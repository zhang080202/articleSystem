<template>
    <div class="container">
        <Form :model="saveItem" :label-width="80">
            <Row>
                <Col span="10">
                    <FormItem label="文章标题">
                        <Input v-model="saveItem.detail.title" ></Input>
                    </FormItem>
                </Col>
                <Col span="2"></Col>
                <Col span="10">
                    <FormItem label="作者">
                        <Input v-model="saveItem.detail.username" disabled ></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="10">
                    <FormItem label="创建时间">
                        <Input v-model="saveItem.detail.createTime" disabled ></Input>
                    </FormItem>
                </Col>
                <Col span="2"></Col>
                <Col span="10">
                    <FormItem label="审核时间">
                        <Input v-model="saveItem.detail.passTime" disabled ></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="10">
                    <FormItem label="修改时间">
                        <Input v-model="saveItem.detail.updateTime" disabled ></Input>
                    </FormItem>
                </Col>
                <Col span="2"></Col>
                <Col span="10">
                    <FormItem label="审核状态">
                        <Select v-model="saveItem.detail.status" >
                            <Option value="0">未审核</Option>
                            <Option value="1">审核中</Option>
                            <Option value="2">已审核</Option>
                            <Option value="3">未通过</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="10">
                    <FormItem label="点赞数量">
                        <p>{{saveItem.detail.praiseNum}}</p>
                    </FormItem>
                </Col>
                <Col span="10">
                    <FormItem label="阅读数量">
                        <p>{{saveItem.detail.readNum}}</p>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="10">
                    <FormItem label="文章类型">
                        <p>{{saveItem.detail.typeValue}}</p>
                    </FormItem>
                </Col>
                <Col span="10">
                    <FormItem label="是否编辑">
                        <RadioGroup v-model="saveItem.detail.isEdit" >
                            <Radio label="1">可编辑</Radio>
                            <Radio label="0">不可编辑</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <FormItem label="标题图片">
                        <Upload
                            type="drag"
                            action="/api/oss/v1/uploadFile"
                            :show-upload-list="showUploadList"
                            :on-success="handleSuccess" 
                            :before-upload="handleBeforeUpload"
                            :on-error="handleError"
                            name="file">
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击上传图片</p>
                            </div>
                            <Spin fix v-if="showSpin"></Spin>
                        </Upload>
                    </FormItem>
                </Col>
                <Col span="4">
                    <div class="page-div">
                        <img :src="saveItem.detail.accessImage" preview preview-text="文章标题图片" class="page-div-img" />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                <FormItem label="文章内容">
                    <vue-tinymce
                        ref="tinymce"
                        v-model="saveItem.detail.content"
                        :setting="setting" >
                    </vue-tinymce >
                </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>
<script>
import { VueTinymce , TinymceSetting } from '@packy-tang/vue-tinymce';

    export default {
        components: { VueTinymce,TinymceSetting }, 
        data() {
            return {
                saveItem: null,
                visible: false,
                showUploadList: false,
                showSpin: false,
                setting: Object.assign({}, TinymceSetting, {
                    height: 200,
                    language_url: "./static/langs/zh_CN.js",
                    block_formats: "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;",
                }),
            }
        },
        props: [
            'value'
        ],
        methods:{
            handleSuccess (res, file) {
                this.saveItem.detail.accessImage = res.data.ossUrl;
                this.saveItem.detail.image = res.data.ossId;
                this.showSpin = false;
                this.$Message.success('上传成功');
            },
            handleError () {
                this.$Message.error('上传失败');
            },
            handleBeforeUpload () {
                this.showSpin = true;
            }
        },
        created() {
            this.$nextTick(() => {
                // debugger;
                this.saveItem = this.value;
                this.saveItem.detail.status = this.saveItem.detail.status.toString();
                // this.saveItem.detail.isEdit = this.saveItem.detail.isEdit.toString();
                // this.image.name = this.value.detail.image;
                // this.image.url = this.value.detail.accessImage;
                // this.content = this.value.detail.content;
            }) 
        },  
        mounted() {
            // this.$nextTick(() => {
            //     this.saveItem = this.value;
            //     this.saveItem.detail.status = this.saveItem.detail.status.toString();
            //     this.image.name = this.value.detail.image;
            //     this.image.url = this.value.detail.accessImage;
            //     this.content = this.value.detail.content;
            // })  
        }, 
    }
</script>
<style>
.container {
    margin-top: 10px;
}
.page-div {
    margin-left: 20px;
    width: 100%;
    height: 100%;
}
.page-div-img {
    width: 100%;
    height: 100%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,0);
}
</style>
