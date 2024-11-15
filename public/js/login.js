import { constant } from '../constant/api.js';

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
})

const login = async (email, password) => {
    try {
        const url = `${constant.BASE_API_URL}/auth/login`;
        const res = await axios({
            method: 'POST',
            url: url,
            data:{
                email,
                password
            }
        })

        console.log("res", res)
    } catch (error) {
        console.log("error", error.response.data    )
    }
}