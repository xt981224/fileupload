<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<el-collapse>
					<el-collapse-item title="新建相册" name="1">
						<el-form ref="form" :model="form">

							<el-form-item>
								<span>相册名称</span>
								<div class="fr">
									<el-input placeholder="请输入新相册" v-model="form.name1" :disabled="xss" @change="changesxss" clearable style="width: 100%;"></el-input>
								</div>
							</el-form-item>
						</el-form>
						<div class="upload">
							<el-upload ref="upload" multiple :http-request="beforeupload" class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
							 list-type="picture">
								<div style="margin: 0 auto;width: 80%;">
									<el-button type="success" class="fl">选择文件</el-button>
									<el-button @click.stop="ondele" style="margin: 0px;" class=" fr">取消选择</el-button>
								</div>
								<div slot="tip" class="el-upload__tip" style="text-align: center;">支持多图片同时上传</div>
							</el-upload>
						</div>
						<el-form ref="form" :model="form">
							<el-form-item>
								<div class="sc">
									<el-button type="primary" @click="onSubmit" class=" fl">立即上传</el-button>
									<!-- <el-button @click="ondele" style="margin: 0px;" class=" fr">取消选择</el-button> -->
								</div>
							</el-form-item>
						</el-form>
					</el-collapse-item>
				</el-collapse>
			</div>
			<!-- 列表状态 -->
			<el-table border :data="failetable" stripe style="width: 760px">
				<el-table-column label="目录" width="">
					<template slot-scope="scope">
						{{scope.row}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-upload" size="mini" @click="tiaozhuan(scope.row)"></el-button>
						<el-button type="success" icon="el-icon-share" size="mini" @click="fuzhi(scope.row)"></el-button>
						<el-button type="primary" icon="el-icon-view" size="mini" @click="yulan(scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog title="分享" :visible.sync="dialogVisible" width="100%">
			<div class="shareurl">
				<el-button type="success" style="width: 100%;" icon="el-icon-share" size="" v-clipboard:copy="address"
				 v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</el-button>
			</div>
			<div class="shareimg">
				<img alt="图片加载失败..." :src="imgUrl" style="margin: 0 auto;" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: "upload",
		data() {
			return {
				imgshare: '',
				dialogVisible: false,
				form: { //form里面的参数
					name: '',
					name1: ''
				},
				url: 'https://ps.loole.tech/',
				address: '',
				xss: false,
				xianshi: false,
				param: "", //表单要提交的参数
				failetable: [], //目录
				imglist: [], //目录下图片
				getimg: { //获取目录图片提交的参数
					dirName: ''
				},
				file: [],
				dele: {
					dirName: ''
				},
				imgUrl: ''
			};
		},
		created() {
			// 获取目录值
			this.getTable()
			this.param = new FormData();
		},
		methods: {
			// 删除按钮
			async removeById(id) {
				const confirmResult = await this.$confirm(
					'此操作将永久删除该目录及目录下所有图片, 是否继续?',
					'提示', {
						confirmButtonText: '取消',
						cancelButtonText: '确定',
						type: 'warning',
						closeOnClickModal: false,
						showClose: false

					}
				).catch(err => err)

				if (confirmResult == 'confirm') {
					return this.$message.info('已经取消删除！')
				}
				this.dele.dirName = id
				const {
					data: res
				} = await this.$http.delete("/v2/deleteDir", {
					params: this.dele
				})
				if (res.code !== 200) {
					return this.$message.error('删除失败！')
				}

				this.$message.success('删除成功！')
				this.getTable()
			},
			// 复制功能
			onCopy(e) { // 复制成功
				this.$message({
					message: '复制成功！',
					type: 'success'
				})
			},
			onError(e) { // 复制失败
				this.$message({
					message: '复制失败！',
					type: 'error'
				})
			},
			new_posters() {

				this.$http
					.get("/v2/qrimage", {
						params: this.getimg,
						responseType: 'arraybuffer',

					}) //设置请求头
					.then(data => {
						// console.log(data);
						//自定义名字 imgUrl 将请求回来的图片信息放到里面
						this.imgUrl =
							"data:image/png;base64," +
							btoa(
								new Uint8Array(data.data).reduce(
									(data, byte) => data + String.fromCharCode(byte),
									""
								)
							);
					})
					.catch(err => {});
			},
			// 复制动态改变地址
			fuzhi(iid) {
				this.getimg.dirName = iid
				this.dialogVisible = true
				const address = `${this.url}/share?iid=${iid}`
				this.address = encodeURI(encodeURI(encodeURI(address)));
				// this.$http.get("/v2/qrimage", {
				// 	params: this.getimg
				// }).then(res=>{
				// 	console.log(res)
				// 	// this.imgshare = res.data
				// })
				this.new_posters()
			},
			// 调转预览代码
			yulan(iid) {
				this.$router.push({
					path: '/share',
					query: {
						iid
					}
				})
			},
			// 跳转目录上传页面
			tiaozhuan(iid) {
				this.$router.push({
					path: '/imgfile',
					query: {
						iid
					}
				})
			},
			changesxss() {
				if (this.form.name1 !== '') {
					this.xianshi = true
					this.form.name = this.form.name1
				} else {
					this.xianshi = false
					this.form.name = ''
				}
			},
			// 获取所有的目录
			getTable() {
				this.$http.get("/v2/myDirs?trace=true").then((res) => {
					if (res.status !== 200) {
						return this.$message.error("获取目录失败")
					}

					this.failetable = res.data.data
				})
			},
			getimgList(e) {
				this.xss = true
				this.getimg.dirName = e
				this.$http.get("/v2/dirFiles?trace=true", {
					params: this.getimg
				}).then(res => {
					if (res.status !== 200) {
						return this.$message.error("获取目录文件失败")
					}
					this.imglist = res.data.data
					// console.log( res.data)

				})
			},
			// 储存上传文件
			beforeupload(file) {
				// this.file.push(file.file)
				this.param.append('files', file.file);
				// console.log(this.param.get("files"))
				// console.log(file)	

				return false;
			},
			// 取消按钮事件
			ondele() {
				this.form.name1 = ''
				this.xianshi = false
				this.form.name = ''
				this.$refs.upload.clearFiles()
			},
			// 上传事件
			onSubmit() {
				if (this.param == '' || this.form.name == '') {
					return this.$message.error("请填写您对应的信息")
				}
				var names = this.form.name;
				this.param.append('specialName', names);
				// for(let i=0;i<this.file.length;i++){
				// 	
				// }
				this.$http.post("/v2/multiple", this.param).then(res => {
					if (res.status !== 200) {
						return this.$message.error("上传失败")
					}
					this.$message.success("上传成功")

					this.param = ''
					this.param = new FormData();

					this.form.name1 = ''
					this.$refs.upload.clearFiles()
					this.getTable()
					// this.$alert(res.data.listData[0].returnPath, '复制链接进行分享', {
					// 	confirmButtonText: '确定',
					// });
					this.getimg.dirName = this.form.name

					this.$http.get("/v2/dirFiles?trace=true", {
						params: this.getimg
					}).then(res => {
						if (res.status !== 200) {
							return this.$message.error("获取目录文件失败")
						}
						this.imglist = res.data.data
					})
				})
			}
		},
	}
</script>
<style>
	.upload {
		margin: 0 auto;
	}

	,
	.ce {
		margin: 0 auto;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.faileimg {
		width: 148px;
		margin: 0 auto;
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

	.box {
		display: flex;
		flex-wrap: wrap;
	}

	.lanm {
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.imgtu {
		width: 50%;
		cursor: pointer;
		/* width: 148px; */
	}

	.imgtu img {
		max-width: 100%;
	}

	.el-upload--picture,
	.wid {
		width: 100%;
	}

	.el-message-box {
		width: 100% !important;
	}

	,
	.shareurl {
		text-align: center;
	}

	.shareimg {
		margin: 0 auto;
		width: 65%;
	}

	.shareimg img {
		width: 100%;
	}

	.sc {
		text-align: center;
		margin: 0 auto;
		width: 100px;
		/* width: 70%; */
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	/* .ml{
		margin-left: 0px;
	} */
</style>
