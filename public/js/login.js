import { constant } from '../constant/api.js';
import { showAlert } from './alters.js';

const form = document.querySelector('.form');
const logoutButton = document.getElementById('logout');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}




const login = async (email, password) => {
    try {
        const url = `${constant.BASE_API_URL}/auth/login`;
        const res = await axios({
            method: 'POST',
            url: url,
            data: {
                email,
                password
            }
        })

        if (res.data.status === "success") {
            showAlert("success", res.data.message);
            window.setTimeout(() => {
                location.assign('/');
                location.reload(true);
            }, 1500)
        }
    } catch (error) {
        showAlert("error", error.response.data.message);
    }
}


const logout = async () => {
    try {
        console.log("heloo")
        const url = `${constant.BASE_API_URL}/auth/logout`;
        const res = await axios({
            method: 'GET',
            url: url,
        })

        if (res.data.status === "success") {
            showAlert("success", res.data.message);
            location.reload(true);
        }
    } catch (error) {
        showAlert("error", "Error logging out! Try again.");
    }
}


if (logoutButton) {
    logoutButton.addEventListener("click", logout)
}