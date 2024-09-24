import React from 'react';
import styles from './popular-deals.module.css';
import Image from 'next/image';

const PopularDeals = () => {
  return (
    <div className={styles.populardeals}>
        <div className={styles.headinglabel}>
            <span className={styles.heading}>POPULAR DEALS</span>
        </div>
        <div className={styles.subheading}>
            <span className={styles.subheadingtext}>We offer the best experience with our rental deals</span>
        </div>
        {/* popular deals cars cards section*/}
        <div  className={styles.populardealscards}>
            {/* card 1 */}
            <div className={styles.carcard}>
                <div className={styles.cardcarimagecontainer}>
                    <Image
                        src="/banners/bmw-M3.png"
                    layout="responsive"  
                    width={200}          
                    height={200}
                    alt="Welcome Car"
                />   
                </div>
                <div className={styles.cardcarname}><b>Jaguar XE L P250</b></div>
                <button className={styles.cardbutton}>
                    Rent Now →
                </button>
            </div>
            {/* card 2 */}
            <div className={styles.carcard}>
                <div className={styles.cardcarimagecontainer}>
                    <Image
                        src="/banners/audi-R8.png"
                    layout="responsive"  
                    width={200}          
                    height={200}
                    alt="Welcome Car"
                />   
                </div>
                <div className={styles.cardcarname}><b>Jaguar XE L P250</b></div>
                <button className={styles.cardbutton}>
                    Rent Now →
                </button>
            </div>
            {/* Card 3 */}
            <div className={styles.carcard}>
                <div className={styles.cardcarimagecontainer}>
                    <Image
                        src="/banners/jaguar-XEL.png"
                    layout="responsive"  
                    width={200}          
                    height={200}
                    alt="Welcome Car"
                />   
                </div>
                <div className={styles.cardcarname}><b>Jaguar XE L P250</b></div>
                <button className={styles.cardbutton}>
                    Rent Now →
                </button>
            </div>
            {/* Card 4 */}
            <div className={styles.carcard}>
                <div className={styles.cardcarimagecontainer}>
                    <Image
                        src="/banners/lamborghini.png"
                    layout="responsive"  
                    width={200}          
                    height={200}
                    alt="Welcome Car"
                />   
                </div>
                <div className={styles.cardcarname}><b>Jaguar XE L P250</b></div>
                <button className={styles.cardbutton}>
                    Rent Now →
                </button>
            </div>
        </div>
        {/* Show all the cars button */}
        <button  className={styles.showallbutton}>
            Show All Vehicles →
        </button>
    </div>
  )
}

export default PopularDeals