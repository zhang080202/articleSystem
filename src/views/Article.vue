<template>
    <div>
        <!-- <p class="article_title">文章管理</p> -->
        <Form :model="searchItem" :label-width="80">
          <Row type="flex" justify="start">
            <Col span="4">
                <FormItem label="文章标题">
                  <Input v-model="searchItem.title" placeholder="请输入文章标题" clearable  ></Input>
                </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="是否公开">
                <Select v-model="searchItem.isPrivate">
                    <Option value="null">全部</Option>
                    <Option value="0">公开文章</Option>
                    <Option value="1">私有文章</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="审核状态">
                <Select v-model="searchItem.status">
                    <Option value="null">全部</Option>
                    <Option value="0">未审核</Option>
                    <Option value="1">审核中</Option>
                    <Option value="2">已审核</Option>
                    <Option value="3">未通过</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="创建日期">
                <Row>
                  <Col span="11">
                    <FormItem prop="date">
                      <DatePicker type="date" placeholder="开始日期" @on-change="getStartDate" ></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                    <FormItem prop="date">
                      <DatePicker type="date" placeholder="结束日期" @on-change="getEndDate"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
                <!-- <DatePicker type="daterange" v-model="searchItem.endDate" :options="options" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
              </FormItem>
            </Col>
            <Col span="2">
              <FormItem>
                <Button type="primary" @click="handleSearch">查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table border :columns="columns" :data="data" :loading="table_loading" class="article_table"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page show-total show-sizer :total="total" :current="currentPage" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>
<style>
/* .article_table {
    margin-top: 10px;
  } */
.article_title {
  font-size: 25px;
  /* line-height: 36px;
    margin-right: 60px; */
  font-family: SourceHanSansCN-Normal;
  font-weight: bold;
  color: #444444;
}
</style>

<script>
  import veArticle from './VeArticle.vue'
  export default {
    data() {
      return {
        searchItem: {
          title: "",
          isPrivate: null,
          status: null,
          startDate: null,
          endDate: null,
          detail: null
        },
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizeOpt: [10, 20, 30, 40],
        table_loading: false,
        columns: [
          {
            title: "序号",
            type: "index",
            align: "center",
            maxWidth: 80
          },
          {
            title: "文章标题",
            key: "title",
            ellipsis: true,
            align: "center"
          },
          {
            title: "标题图片",
            key: "accessImage",
            align: "center",
            maxWidth: 200,
            maxHeight: 200,
            render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.accessImage
                },
                style: {
                  width: "100%",
                  height: "100%"
                }
              });
            }
          },
          {
            title: "是否公开",
            key: "isPrivate",
            maxWidth: 150,
            align: "center",
            render: (h, params) => {
              return h(
                "Tag",
                {
                  props: {
                    color: params.row.isPrivate ? "green" : "blue",
                    type: "border",
                    fade: true
                  }
                },
                params.row.isPrivate ? "私有文章" : "公开文章"
              );
            }
          },
          {
            title: "文章类型",
            key: "remark",
            align: "center",
            maxWidth: 150
          },
          {
            title: "作者",
            key: "userName",
            align: "center",
            maxWidth: 150
          },
          {
            title: "创建时间",
            key: "createTime",
            align: "center",
            maxWidth: 150
          },
          {
            title: "审核时间",
            key: "passTime",
            align: "center",
            maxWidth: 150
          },
          {
            title: "审核状态",
            key: "statusValue",
            maxWidth: 150,
            align: "center"
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.show(params.row);
                      }
                    }
                  },
                  "查看"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        data: [],
        detail: {}
      };
    },
    methods: {
      async show(data) {
        const _this = this;
        await _this.getArticlerById(data);
        _this.$Modal.confirm({
          title: "文章详情",
          cancelText: "取消",
          okText: "保存",
          width: 1000,
          loading: true,
          render: h => {
            return h(veArticle, {
              props: {
                value: _this.detail
              }
            });
          },
          onOk: () => {
            console.log(_this.detail)
            this.saveArticle(_this.detail)
          }
        });
      },
      remove(params) {
        this.deleteArticle(params.articleId);
      },
      getStartDate(startDate) {
        this.searchItem.startDate = startDate + " 00:00:00";
      },
      getEndDate(endDate) {
        this.searchItem.endDate = endDate + " 23:59:59";
      },
      handleSearch(params) {
        this.getArticlerList();
      },
      //页码变化
      changePage(page) {
        this.currentPage = page;
        this.getArticlerList();
      },
      //每页显示条数变化
      changePageSize(page) {
        this.pageSize = page;
        this.getArticlerList();
      },
      //获取文章列表
      getArticlerList() {
        this.table_loading = true;
        this.$http.get(
            "/article/v1/getArticlerListAll/" + this.currentPage + "/" + this.pageSize + "/" + JSON.stringify(this.searchItem)
          )
          .then(({ data }) => {
            console.log("-------getArticlerListAll-------->", data);
            this.total = data.data.total;
            this.data = data.data.records;
            this.table_loading = false;
          })
          .catch(err => {
            console.log(err);
            this.table_loading = false;
            this.$Message.error(err);
        });
      },
      //获取文章详情
      getArticlerById(data) {
        this.table_loading = true;
        return new Promise(resolve => {
          this.$http.get(
            "/article/v1/getArticlerById/" + data.articleId + "/" + data.createUser + "/0"
          )
          .then(({ data }) => {
            console.log("--------getArticlerById------->", data);
            this.detail = data.data;
            this.table_loading = false;
            resolve();
          })
          .catch(err => {
            console.log(err);
            this.table_loading = false;
            this.$Message.error(err);
          });
        })
      },
      saveArticle(params) {
        return new Promise(resolve => {
          this.$http.post("/article/v1/updateArticle", params.detail)
          .then(({ data }) => {
            this.$Modal.remove();
            this.$Message.success('保存成功');
            this.getArticlerList();
            resolve();
          })
          .catch(err => {
            console.log(err);
            this.$Modal.remove();
            this.$Message.error(err);
          });
        })
      },
      deleteArticle(params) {
        this.table_loading = true;
        return new Promise(resolve => {
          this.$http.get("/article/v1/deleteArticle/" + params)
          .then(({ data }) => {
            this.getArticlerList();
            this.$Message.success('删除成功');
            resolve();
          })
          .catch(err => {
            console.log(err);
            this.$Message.error(err);
          });
        })
      }
    },
    mounted() {
      this.getArticlerList();
    }
  };
</script>
