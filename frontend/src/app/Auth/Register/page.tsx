import React from 'react';
import styles from './register-page.module.css';
import Image from 'next/image';
const Register = () => {
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
        <span className={styles.logintext}>Register</span>
        <div className={styles.inputfields}>
            <input type='text' className={styles.emailinput} placeholder='Name'></input>  
            <input className={styles.emailinput} placeholder='Email'></input>
            <input type='number' className={styles.phoneinput} placeholder='phone'></input>
            <input type='text' className={styles.emailinput} placeholder='City'></input>
            <input type='text' className={styles.emailinput} placeholder='State'></input>
            <input type='text' className={styles.emailinput} placeholder='Country'></input>      
            <input type='password' className={styles.passwordinput} placeholder='Password'></input>
            <button className={styles.registerbutton}>Register</button>
            <p className={styles.logintext}>Do not have an account?</p>
            <p className={styles.loginlink}>Login</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
