import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.prod.min.js"
import pagination from "./pagination.js"

let productModal =``;
let delModal = ``;

const app = createApp({
	data(){
		return {
			apiUrl: 'https://vue3-course-api.hexschool.io/v2',
			api_path: 'blacknwhiterabbit',
			temp:{
				imagesUrl:[]
			},
			products:[],
			isNew:false,
			page:{}
		}
	},
	methods:{
		checkLogin(){
			this.getToken();
			axios.post(`${this.apiUrl}/api/user/check`)
				.then(res=>{
					this.getProducts();
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
		getProducts(page=1){
			this.getToken();
			axios.get(`${this.apiUrl}/api/${this.api_path}/admin/products/?page=${page}`)
				.then(res=>{
					this.products = res.data.products;
					this.page = res.data.pagination;
					console.log(res.data);
				})
				.catch(err=>{
					alert(err.response.data.message);
				})
		},
		updateProducts(){
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
				this.getProducts();
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
				delModal.hide();
				this.getProducts();
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
		createImages() {
      this.temp.imagesUrl = [];
      this.temp.imagesUrl.push('');
    },
	},
	components:{
		pagination
	},
	mounted(){
		this.checkLogin()
		productModal = new bootstrap.Modal(document.querySelector("#productModal"));
		delModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
	}
})

app.component('product-modal',{
	props: ['temp','updateProducts'],
	template: '#product-modal-template'
})

app.component('del-modal',{
	props:['delProduct'],
	template:'#del-modal'
})

app.mount("#app")