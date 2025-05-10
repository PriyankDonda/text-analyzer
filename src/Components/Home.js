import React, { useState, useEffect } from 'react'

function Home() {
    const [inputText, setInputText] = useState("")
    const [word, setWord] = useState(0)
    const [sentence, setSentence] = useState(0)
    const [character, setCharacter] = useState(0)
    const [previewText, setPreviewText] = useState("")
    const [tmlBtnActive, setTmlBtnActive] = useState("capitalization-btn")
    const [previewStyle, setPreviewStyle] = useState("none")
    const [loaderStyle, setLoaderStyle] = useState("none")

    const countWord = (temptext) => {
        const warr = temptext.split(' ');
        return warr.filter(word => word !== '').length;
    }
    const countCharacter = (temptext) => {
        let carr = temptext.trim();
        // carr = temptext.replace(/ /g, "");
        return carr.length;
    }
    const countSentence = (temptext) => {
        const scount = temptext.split(".").length - 1;
        return scount;
    }

    useEffect(() => {
        setWord(countWord(inputText));
        setCharacter(countCharacter(inputText));
        setSentence(countSentence(inputText));

        if (tmlBtnActive === "capitalization-btn") {
            textToCapitalization();
        } else if (tmlBtnActive === "uppercase-btn") {
            textToUppercase();
        } else {
            textToLowercase();
        }
        //eslint-disable-next-line
    }, [inputText])

    const textToUppercase = () => {
        setInputText(inputText.toUpperCase());
    }
    const textToUppercaseBtn = () => {
        // button active code
        document.getElementById(tmlBtnActive).classList.remove("tml-btn-active");
        document.getElementById("uppercase-btn").classList.add("tml-btn-active");
        setTmlBtnActive("uppercase-btn");
        // text to uppercase
        textToUppercase();
    }

    const textToLowercase = () => {
        setInputText(inputText.toLowerCase());
    }
    const textToLowercaseBtn = () => {
        // button active code
        document.getElementById(tmlBtnActive).classList.remove("tml-btn-active");
        document.getElementById("lowercase-btn").classList.add("tml-btn-active");
        setTmlBtnActive("lowercase-btn");
        // text to lowercase
        textToLowercase();
    }

    const textToCapitalization = () => {
        let textCapitalization = inputText.split(". ")
        let capitalizedtext = textCapitalization.map((text) => {
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        }).join(". ")

        // console.log(capitalizedtext)
        setInputText(capitalizedtext);
    }
    const textToCapitalizationBtn = () => {
        // button active code
        document.getElementById(tmlBtnActive).classList.remove("tml-btn-active");
        document.getElementById("capitalization-btn").classList.add("tml-btn-active");
        setTmlBtnActive("capitalization-btn");
        // text to capitalization
        textToCapitalization();
    }

    const showPreview = async () => {
        console.log("previewing...", parseInt(sentence / 2))
        if (inputText === "") {
            alert("Please write something first!")
        }
        else {
            setLoaderStyle("flex");
            setPreviewStyle("none");
            if (sentence >= 2) {
                const formdata = new FormData();
                formdata.append("key", process.env.REACT_APP_API_KEY);
                formdata.append("txt", `${inputText}`);
                formdata.append("sentences", `${parseInt(sentence / 2)}`);

                const requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };

                await fetch("https://api.meaningcloud.com/summarization-1.0", requestOptions)
                    .then(async (res) => {
                        const data = await res.json()
                        console.log(data.summary)
                        setPreviewText(data.summary)
                        setLoaderStyle("none");
                        setPreviewStyle("flex")
                    })
                    .catch(error => {
                        setPreviewText(inputText)
                        setLoaderStyle("none");
                        setPreviewStyle("flex")
                        console.log('error', error)
                    });
            } else {
                setPreviewText(inputText)
            }
        }
    }

    const clearInputText = () => {
        // document.querySelector("preview-box").style.display = "none";
        setPreviewStyle("none")
        setInputText("")
    }

    return (
        <>
            <div className='center'>
                <div className='box'>
                    <div className='textarea-header'>
                        <div className='count'>
                            <span className='count-header'>Word : </span>
                            <span className='count-number'>{word}</span>
                        </div>
                        <div className='count'>
                            <span className='count-header'>Character : </span>
                            <span className='count-number'>{character}</span>
                        </div>
                        <div className='count'>
                            <span className='count-header'>Sentence : </span>
                            <span className='count-number'>{sentence}</span>
                        </div>
                    </div>

                    <div className='textarea-middle'>
                        <div className='textarea-middle-left'>
                            <button id='capitalization-btn' className='tml-btn tml-btn-active' onClick={() => textToCapitalizationBtn()}>Capitalization</button>
                            <button id='uppercase-btn' className='tml-btn' onClick={() => textToUppercaseBtn()}>Uppercase</button>
                            <button id='lowercase-btn' className='tml-btn' onClick={() => textToLowercaseBtn()}>Lowercase</button>
                        </div>
                        <div className='textarea-middle-right'>
                            <textarea className='input-textarea' placeholder='Write Your Text Here...' value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>

                            <div className='textarea-footer'>
                                <button className='preview-btn' onClick={() => clearInputText()}>Clear All </button>
                                <button className='preview-btn' onClick={() => showPreview()}>Preview </button>
                            </div>
                        </div>
                    </div>

                    <div className=" align-items-center justify-content-center" style={{ display: loaderStyle }}>
                        <strong>Loading...</strong>
                    </div>

                    <div className='preview-box' style={{ display: previewStyle }}>
                        <div className='textarea-middle-left'>
                            <div className='count preview-count'>
                                <span className='preview-count-header'>Word : </span>
                                <span className='preview-count-number'>{countWord(previewText)}</span>
                            </div>
                            <div className='count preview-count'>
                                <span className='preview-count-header'>Character : </span>
                                <span className='preview-count-number'>{countCharacter(previewText)}</span>
                            </div>
                            <div className='count preview-count'>
                                <span className='preview-count-header'>Sentence : </span>
                                <span className='preview-count-number'>{countSentence(previewText)}</span>
                            </div>
                        </div>
                        <div className='textarea-middle-right preview-text-box'>
                            {/* <p className='preview-text'>{previewText}</p> */}
                            {
                                previewText.includes("[...] ") === true
                                    ?
                                    previewText.split("[...] ").map((temp) => (
                                        <><p id='preview-text'>{temp}</p></>
                                    ))
                                    :
                                    <p id='preview-text'>{previewText}</p>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home