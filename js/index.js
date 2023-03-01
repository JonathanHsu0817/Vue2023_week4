import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.prod.min.js"

const app = {
  data(){
    return {
      user:{
        username:``,
        password:``
        }
      }
  },
  methods:{
    login(){
      axios.post(`https://vue3-course-api.hexschool.io/v2/admin/signin`,this.user)
        .then(res=>{
					const { expired,token } = res.data
					document.cookie = `hexschool=${token}; expires=${expired}`;
					// localStorage.setItem("token",token);//localStorage
					window.location.replace("./products.html")
        })
				.catch(err=>{
					console.log(err);
					alert("登入失敗");
				})
    },
		getToken(){
			const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1")
			axios.defaults.headers.common['Authorization'] = token;
			// localStorage.getItem(token);//localStorage
		},
  },
  mounted(){

  }
}

createApp(app)
  .mount("#app")