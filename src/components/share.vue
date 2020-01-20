<template>
	<div>
		<el-card class="box-card" style="">
		  <div slot="header" class="clearfix">
			{{this.$route.query.iid}}
			</el-page-header>
		  </div>
		  <div class="box">
			  <div  class="text item imgtu" v-for="item in imglist" :key="item"  >
				    <div class="imgtuitem">
					  <img v-gallery:groupName :src="item" style="width: 100%;" />
				    </div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	  export default {
		name: "share",
		data(){
			return{
				imglist:'',//图片
				getimg:{//获取目录图片提交的参数
					dirName:''
				},
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
		  getimgList(){
		  	this.getimg.dirName = this.$route.query.iid
		  	this.$http.get("/v2/dirFiles?trace=true",{
		  	params: this.getimg
		  	}).then(res=>{
		  	if(res.status!==200){
		  		return this.$message.error("获取目录文件失败")
		  	}
		  	this.imglist = res.data.data
		  	})
		  },
		  }
			}
</script>

<style scoped>
	.imgtu{
		width: 100%;
	}
	.clearfix{
		text-align: center;
	}
	.imgtuitem img{
		border-radius: 3%;
		 box-shadow:5px 5px 10px 0px rgba(0, 0, 0, 0.19);
	}
</style>
