# Intern Auguest progess

## 08/02 - 08/09

1. Dashboard config 中的category现在有一个type property。可以在config page在创建新category时选择。支持常规类和模板类。可以展示选中的type。

1. React-grid-layout now can reload layout when receiving new elements from db
Before, RGL in ContainerTemplate only has data-grid to track items'layout:

```js
<ReactGridLayout
        {...reactGridLayoutDefaultProps}
        onLayoutChange={onLayoutChange}
        isDraggable={editable}
        isResizable={editable}
      >
        {
          elements.map((ele, i) =>
            <div key={ele.name} data-grid={genDataGrid(ele)}>
    {//and other props}
    </div>
```

But according to issue #382 in react-grid-layout, 

> The error others have made is:
>
> Assuming you can purely load elements off of data-grid={layout object} (here, the prop layout (for ReactGridLayout) / layouts (for ResponsiveGridLayout) are NOT being used)
>
> Assuming you can purely use the prop layout / layouts *without using data-grid={layout object}
>
> In actuality, you must use BOTH the prop layouts / layout AND data-grid={layout object}, in order to get state storage to work as is:
>
> In whatever memory object you are using to track items' layouts, you MUST pass these layout objects to the ReactGridLayout/ ResponsiveGridLayout's "layout/layouts" prop.
> 
> In addition, you MUST still specify data-grid={el.layout} (if you do NOT do this, the grid layout does NOT update correctly even if you specify updated values for the layout/layouts prop.

So we add 

```js
<ReactGridLayout
        {...reactGridLayoutDefaultProps}
        onLayoutChange={onLayoutChange}
        isDraggable={editable}
        isResizable={editable}
        {/*This is newly added*/}
        layout={elements.map(ele => { return { x: +ele.x, y: +ele.y, h: +ele.h, w: +ele.w, i: ele.name } })}
      >
        {
          elements.map((ele, i) =>
            <div key={ele.name} data-grid={genDataGrid(ele)}>
            {...other props}
```
1. minor bug fix: when content is null, cyberbrick dashboard shouldn't fetchQuery

1. 为go写了一个可以向mongo CRUD的api, listening at port localhost:8089
1. 更新了dockerfile, 新增一个bash file that can create compound unique index with given collections
1. 学习了typeorm和nestjs (粗略了解)

## 08/09 - 08/15

1. 在 nodejs 上实现了向 go api 发请求以及接受请求/错误处理的功能。在 `gallery` 中的 `provider` 新增 `MongoService`
1. 尝试用 `middleware` 来向 go api query, 了解到 `middleware` 不应该涉及业务逻辑因此把该逻辑迁移到 `MongoService` 中
1. 修改 frontend 代码，在向nodejs发送 `SaveContentInCategory` 请求时附加 element `type` 作为query param。
1. 修改nodejs 代码，在post `SaveContentInCategory` 时, 接受一个 `type` 的 `@Query`, 调用新写的 `saveContentToMongoOrPg`, `switch(type)`若是 `text` or `image`, 在 `saveToPg` 先 call go api save to mongo, get mongo objectID, put the objectID back to content.data, and then save to pg; Otherwise, directly save to pg
1. 修改了content的date的格式，保证在传给go api时可以被parse
1. nodejs通过typeorm 实现了 element soft-delete
1. 更新了前端的text presentor逻辑: 为content新增 `storageType` property, 在 fetchQuery的时候将 `storageType` 作为query传给nodejs, nodejs 根据 storageType 决定向 pg 还是向 mongodb fetch content. 拿到content后返回给前端
   - 更新了modulePanelGenerator的逻辑，为modulePresentor新增了一个updateContent的props, 这样在presentor模式下拿到了content.data可以被editor 通过 props.content 共享
1. 更新了nestedSimpleModule的逻辑: 打平存储每个tab对应的module content。先将每个module的content存进pg Content的表中，拿到content id，
   将module变成一个pointer指向pg中实际的content。最后再把整个nestedModule的content存起来。
1. 将nestedSimpleModule内嵌的module从ModulePanel改成TemplateElement。将fetchQuery from mongodb的逻辑提到nodejs的api中。
1. 修改了fetchContent的逻辑，保证nestedSimpleModule每个内嵌的module只会与数据库交互一次。(overwrite fetchContent func inside CreateModule.tsx)
    Warning: 
      1. ModulePanel/Collection/NestedSimpleModule/EmbededMoule/CreateModule.tsx, fetchContent func:
        Refetch logic only works when content received from db has not null data
      2. web/server/gallery/provider/content.service.ts: getNestedElementContent func
        This function assumes that all content with "mongodb" as storage
        type will fetch data from 3rd party library (in this case mongodb)

Fixed Bug list:
1. config-分类-仪表板删除tag，violate foreign key constraint (fixed)
2. config-分类 修改描述-> 类型变化 (fixed)
3. config-分类-符号，新建符号-> null value in column "categoryName" violates not-null constraint (fixed)
4. nestedmodule text/number input联动 (fixed)

Remaining Bug list:
1. dataset menuItem missing key
2. text editor第二次打开格式混乱

## 08/16 - 08/22

1. 重写了运行server-go的dockerFile. 将base image设为golang, server image built based on base image. 
2. 将collection中type xlsxTable以及flexTable的content存进mongodb. 
3. 重构了cyberbrick前端的代码以适应content.data变成"pointer data"
4. 新写了一个fieldHeader的组件, 用作分隔页面内的板块, 用户编辑时可选择text, fontSize, and allignment. 展示模式时没有背景和边框.
5. 重构nodejs中的contentMongo service, 使其read path from config.js
6. modulePanel 在template模式下可以编辑description。存进element对应的table中。只有在template模式下才可以展示description
7. 提醒用户在dashboard中若tabPane为空去配置新建界面。
8. 重构server-go。将read config以及initialize database放进main.go; 新建middleware用来处理header.


## GO-MONGO-API Manual:

### 新增collection type

1. docker/docker-mongodb/.env中将新增的elementType填入DB_COLLECTION_NAME中，并执行./create_unique_index
2. web/server/gallery/provider/contentMongo.service.ts 中，修改 `async saveContentToMongoOrPgByType(type: string, content: Content)`的switch statement, 将新增的elementType加入case中, 并 `return this.saveContentToMongo(type, content)`
3. web/server/gallery/common.ts中, 修改`const shouldQueryAfterRecevingContent`的switch语句, 将新增的elementType加入case中, 并 `return true`
4. web/server/gallery/common.ts中, 修改`const ContentValidationByType`的switch语句, 将新增的elementType加入case中, 并 `return MongoContentValidation(data)`
5. resources/go.env中, 新增的elementType填入`DB_COLLECTION_NAME`中。

