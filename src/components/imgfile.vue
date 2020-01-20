<template>
	<div>
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
			<el-page-header @back="goBack" :content="this.$route.query.iid">
			</el-page-header>
		  </div>
		  <div class="box">
			  	<div class="zengjia">
			  	<div class="imgtuitem">
			  	<el-upload
			  			:http-request="uploadimg"
			  			:show-file-list="false"
			  	  action="https://jsonplaceholder.typicode.com/posts/"
			  	  list-type="picture-card"
			  	  style="margin: 0 auto;"
			  	 >
			  	  <i class="el-icon-plus"></i>
			  	  </el-upload>
			  	  </div>
			  
			  </div>
			  <div  class="text item imgtu" v-for="item in imglist" :key="item"  >
				  <div class="imgtuitem">
					  <img v-gallery:groupName :src="item" style="width: 148px;height: 148px;" />
					</div>
				</div>
			
			</div>
		</el-card>
	</div>
</template>

<script>
	
	 export default {
		 name: "imgfile",
	    data() {
	        return {
				imglist:'',//图片
				getimg:{//获取目录图片提交的参数
					dirName:''
				},
				dialogImageUrl: '',
        dialogVisible: false,
		 param:""
			}
			},
			created() {
				// 获取图片列表
				this.getimgList()
			},
			methods:{
				goBack() {
				this.$router.push({path: '/'})

			  },
				// 上传
				uploadimg(file){
					this.param = new FormData();
					this.param.append('files', file.file);
					this.param.append('specialName', this.$route.query.iid);
					this.$http.post("/v2/multiple", this.param).then(res=>{
						if(res.status!== 200){
						return	this.$message.error("上传失败")
						}
						this.getimgList()
						this.$message.success("上传成功")
					})
				},
				// 获取所有
				getimgList(){
					this.getimg.dirName = this.$route.query.iid
					this.$http.get("/v2/dirFiles?trace=true",{
					params: this.getimg
					}).then(res=>{
					if(res.status!==200){
						return this.$message.error("获取目录文件失败")
					}
					this.imglist = res.data.data
					// console.log( res.data)
					
					})
				},
						
			},
			}
</script>

<style scoped>
	 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    max-width: 760px;
	margin: 0 auto;
  }
  .box{
	  display: flex;
	   flex-wrap: wrap;
  }
  .imgtu{
	  width: 50%;
  }
  .imgtu,.zengjia{
	      width: 50%;
  }
  .imgtuitem{
	  width: 148px;
	  height: 148px;
	  margin: 0 auto;
  }
  .imgtuitem img{
	  height: 148px;
  }
  .el-message-box{
	  width: 100% !important;
  }.wc-preview-img{
	  width: 148px;
  }
</style>
