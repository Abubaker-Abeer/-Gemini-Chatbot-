const typingForm = document.querySelector('.typing-form');
const chatlist = document.querySelector('.chat-list');
const toggleThemeButton = document.querySelector('#toggle-theme-button');



let userMessage = null;
const YOUR_API_KEY = "AIzaSyBw1KZQppLd9O_dN9tWClBLTjyQ_DsMdZc";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${YOUR_API_KEY}`;

const loadLocalstorgeData =() =>{
  const savedchats=  localStorage.getItem("savedchats")
  const isLightMode =(localStorage.getItem("themeColor") ==="light_mode")
    document.body.classList.toggle("light_mode",isLightMode)
    toggleThemeButton.innerText=isLightMode ? "dark_mode" : "light_mode"
    chatlist.innerHTML=savedchats ||"";
    chatlist.scrollTo(0, chatlist.scrollHeight)

}
loadLocalstorgeData();
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add('message', ...classes);
    div.innerHTML = content;
    return div;
};
const showTypingEffect=(text ,textElement,incomingMessageDiv)=>{
    const words = text.split(' ');
    let currentWordIndex =0;
const typingInterval =setInterval(()=>{
textElement.innerText+=(currentWordIndex ===0? '' : ' ')+words[currentWordIndex++]
incomingMessageDiv.querySelector('.icon').classList.add('hide');  
if(currentWordIndex === words.length){
    clearInterval(typingInterval)
    incomingMessageDiv.querySelector('.icon').classList.remove('hide');  
    localStorage.setItem("savedchats",chatlist.innerHTML)
}
    chatlist.scrollTo(0, chatlist.scrollHeight)
   
},75);
}
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement =incomingMessageDiv.querySelector('.text')
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('API request failed');
        }

        const data = await response.json();
        const apiResponse =data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
         showTypingEffect(apiResponse ,textElement,incomingMessageDiv)
    } catch (error) {
        console.error('Error occurred:', error);
    } finally{
        incomingMessageDiv.classList.remove('loading')
    }
};

const showLoadingAnimation = () => {
    const html = `
        <div class="message-content">
            <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
        <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>
    `;
    
    const incomingMessageDiv = createMessageElement(html, 'incoming', 'loading');
    chatlist.appendChild(incomingMessageDiv);

    chatlist.scrollTo(0, chatlist.scrollHeight)
    generateAPIResponse(incomingMessageDiv);
};

const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector('.text').innerText; // استخدم innerText للحصول على النص
    navigator.clipboard.writeText(messageText).then(() => {
        copyIcon.innerText = "done";
        setTimeout(() => copyIcon.innerText = "content_copy", 1000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector('.typing-input').value.trim();
    if (!userMessage) return;

    const html = `
        <div class="message-content">
            <img src="images/user.jpg" alt="User Image" class="avatar">
            <p class="text"></p>
        </div>
    `;
    
    const outgoingMessageDiv = createMessageElement(html, 'outgoing');
    outgoingMessageDiv.querySelector('.text').innerHTML = userMessage;
    chatlist.appendChild(outgoingMessageDiv);
    typingForm.reset();
    chatlist.scrollTo(0, chatlist.scrollHeight)

    setTimeout(showLoadingAnimation, 500);
};

toggleThemeButton.addEventListener("click",() =>{
const isLightMode=document.body.classList.toggle("light_mode")
localStorage.setItem("themeColor",isLightMode ? "light_mode" : "dark_mode")
toggleThemeButton.innerText=isLightMode ? "dark_mode" : "light_mode"
});
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutgoingChat();
});
