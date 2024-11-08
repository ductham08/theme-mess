import React, { useState } from 'react'
import "../../assets/css/style.scss"
import { Link } from 'react-router-dom'
import { flag_1, flag_2, flag_3, logoText } from '../../assets/images/images';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';


const ContentComponent = () => {

    const [activeMenu, setActiveMenu] = useState(false)

    const handleOpenMenu = () => {
        setActiveMenu(!activeMenu)
    }

    return (
        <div className="home-manager">
            <header className="header">
                <div className="header_desk">
                    <div className="container">
                        <div className="content-left">
                            <div className="logo">
                                <img src={logoText} width="100%" alt="" />
                            </div>
                            <Link to="">Products</Link>
                            <Link to="">Pricing</Link>
                            <Link to="">Contact</Link>
                        </div>
                        <div className="content-right">
                            <Select
                                defaultValue="English"
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select.Option value="English">
                                   <img src={flag_1} alt="" />
                                    English
                                </Select.Option>
                                <Select.Option value="ภาษาไทย">
                                    <img src={flag_2} alt="" />
                                    ภาษาไทย
                                </Select.Option>
                                <Select.Option value="Português">
                                    <img src={flag_3} alt="" />
                                    Português
                                </Select.Option>
                            </Select>
                            <Link className='btn-signin' to="#">Sign in</Link>
                        </div>
                    </div>
                </div>

                <div className="header_mobile">
                    <div className="menu_set">
                        <div className="container">
                            <div className="logo">
                                <a href="./index.html">
                                    <img src={logoText} width="100%" alt="" />
                                </a>
                            </div>

                            <div onClick={handleOpenMenu} className={`btn_menu_mobile ${activeMenu == true ? 'active' : ''}`} >
                                <div className="item_menu top"></div>
                                <div className="item_menu center"></div>
                                <div className="item_menu bottom"></div>
                            </div>
                        </div>
                    </div>

                    <div className={`menu_move ${activeMenu == true ? 'active' : ''}`}>
                        <div className="container">
                            <Link to="">Products</Link>
                            <Link to="">Pricing</Link>
                            <Link to="">Contact</Link>
                            <Link to="">Language:</Link>
                            <Select
                                defaultValue="English"
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select.Option value="English">
                                <img src={flag_1} alt="" />
                                    English
                                </Select.Option>
                                <Select.Option value="ภาษาไทย">
                                    <img src={flag_2} alt="" />
                                    ภาษาไทย
                                </Select.Option>
                                <Select.Option value="Português">
                                    <img src={flag_3} alt="" />
                                    Português
                                </Select.Option>
                            </Select>
                            <hr />
                            <Link className='btn-signin' to="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#2F80ED"></path></svg>
                                Sign in with Facebook
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default ContentComponent
