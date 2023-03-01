import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.prod.min.js"

// import config from "./config.js";
// const {url,api_path} = config;

let productModal =``;
let delModal = ``;

const app = {
	data(){
		return {
			apiUrl: 'https://vue3-course-api.hexschool.io/v2',
			api_path: 'blacknwhiterabbit',
			temp:{
				imagesUrl:[]
			},
			products:[],
			isNew:false,
		}
	},
	methods:{
		checkLogin(){
			this.getToken();
			axios.post(`${this.apiUrl}/api/user/check`)
				.then(res=>{
					this.getProductsData();
				})
				.catch(err=>{
					alert(err.response.data.message)
					window.location.replace("./index.html");
				})
		},
		getToken(){
			const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1")
			axios.defaults.headers.common['Authorization'] = token;
			// localStorage.getItem(token);//localStorage
		},
		getProductsData(){
			this.getToken();
			axios.get(`${this.apiUrl}/api/${this.api_path}/admin/products`)
				.then(res=>{
					this.products = res.data.products;
				})
				.catch(err=>{
					alert(err.response.data.message);
				})
		},
		updateProductsData(){
			this.getToken();

			let url = `${this.apiUrl}/api/${this.api_path}/admin/product`;
			let http = 'post';

			if(!this.isNew){
				url = `${this.apiUrl}/api/${this.api_path}/admin/product/${this.temp.id}`;
				http = 'put';
			}

			axios[http](url, { data: this.temp }).then((response) => {
				alert(response.data.message);
				productModal.hide();
				this.getProductsData();
				}).catch((err) => {
					alert(err.response.data.message);
			})
		},
		delProduct() {
			this.getToken();
			const url = `${this.apiUrl}/api/${this.api_path}/admin/product/${this.temp.id}`;

			axios.delete(url)
				.then((response) => {
				alert(response.data.message);
				delProductModal.hide();
				this.getProductsData();
				})
				.catch((err) => {
				alert(err.response.data.message);
				})
		},
		openModal(isNew,item){
			if(isNew === "new"){
				this.temp ={
					imagesUrl:[]
				}
				this.isNew = true;
				productModal.show();
			}else if(isNew === "edit"){
				this.temp ={...item};
				this.isNew = false;
				productModal.show();
			}else if(isNew === "delete"){
				this.temp ={...item};
				delModal.show();
			}
		},
		addImages(){
			this.temp.imagesUrl=[];
		}
	},
	mounted(){
		this.checkLogin()
		productModal = new bootstrap.Modal(document.querySelector("#productModal"));
		delModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
	}
}

createApp(app)
  .mount("#app")