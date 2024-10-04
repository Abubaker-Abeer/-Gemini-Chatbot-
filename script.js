const typingForm =document.querySelector('.typing-form')
const chatlist =document.querySelector('.chat-list')

let userMessage=null;
const  creatMessageElement=(content,...classes)=>{
   const div =document.createElement("div");
   div.classList.add('message',...classes);
   div.innerHTML=content;
   return div;
}
const showLoadingAnimation =()=>{
    const html =` <div class="message-content">
            <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
              <p class="text"></p>
               <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>

               </div>
            </div>
        <span class=" icon material-symbols-rounded">content_copy</span>`;
    
        const incomingMessageDiv =     creatMessageElement(html,'incoming' ,'loading');   
     chatlist.appendChild(incomingMessageDiv);
}
const handleOutgoingChat =()=>{
    userMessage = typingForm.querySelector('.typing-input').value.trim();
    if(!userMessage)return;
const html =`<div class="message-content">
            <img src="images/user.jpg" alt="User Image" class="avatar">
              <p class="text"></p>
        </div>`;
     const outgoingMessageDiv =     creatMessageElement(html,'outgoing');   
     outgoingMessageDiv.querySelector('.text').innerHTML=userMessage;
     chatlist.appendChild(outgoingMessageDiv);
     typingForm.reset();
     setTimeout(showLoadingAnimation,500);
}
typingForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      handleOutgoingChat();
});