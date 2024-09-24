import React from 'react';
import styles from './login-page.module.css';
import Image from 'next/image';
const Login = () => {
  return (
    <div className={styles.login}>
      {/* Your login form or content can go here */}
      <div className={styles.loginform}>
        <div className={styles.cardcarimagecontainer}>
                      <Image
                          src="/icons/brandlogo.svg"
                      layout="responsive"  
                      width={10}          
                      height={10}
                      alt="Welcome Car"
                  />   
        </div>
        <span className={styles.logintext}>Login</span>
        <div className={styles.inputfields}>
          <input className={styles.emailinput} placeholder='Email'></input>
          <input type='password' className={styles.passwordinput} placeholder='Password'></input>
          <button className={styles.loginbutton}>Login</button>
          <p className={styles.registertext}>Do not have an account?</p>
          <p className={styles.registerlink}>Register</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
