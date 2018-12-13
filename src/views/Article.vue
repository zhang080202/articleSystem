<template>
    <div>
        <Table border :columns="columns" :data="data" :loading="table_loading"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page show-total show-sizer :total="total" :current="currentPage" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
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
          maxWidth: 200
        },
        {
          title: "标题图片",
          key: "accessImage",
          maxWidth: 200,
          maxHeight: 200,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.accessImage
              },
              style: {
                width: '100%',
                height: '100%'
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
            return h("Tag", {
              props: {
                color: params.row.isPrivate ? "green" : "blue",
                type: "border",
                fade: true
              },
            }, params.row.isPrivate ? "私有文章" : "公开文章");
          }
        },
        {
          title: "文章类型",
          key: "articleType",
          // maxWidth: 200,
          // render: (h, params) => {
          //   return h("Tag", {
          //     props: {
          //       color: params.row.isPrivate ? "green" : "blue",
          //       type: "border",
          //       fade: true
          //     },
          //   }, params.row.isPrivate ? "私有文章" : "公开文章");
          // }
        },
        {
          title: "Action",
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
                      this.show(params.index);
                    }
                  }
                },
                "View"
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
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${
          this.data6[index].age
        }<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    changePage(page) {
      this.currentPage = page;
      this.getArticlerList();
    },
    getArticlerList() {
      this.table_loading = true;
      this.$http.get(
          "/article/v1/getArticlerListAll/" + this.currentPage + "/" + this.pageSize
        )
        .then(({ data }) => {
          console.log("--------------->", data);
          this.total = data.data.total;
          this.data = data.data.records;
          this.table_loading = false;  
        })
        .catch(err => {
          console.log(err);
          this.table_loading = false;
        });
    }
  },
  mounted() {
    this.getArticlerList();
  }
};
</script>
