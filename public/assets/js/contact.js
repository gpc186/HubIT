//funcao de copiar email
function CopiarEmail(){
    const copiarTexto = document.getElementById("copiarE")

    //selecionar o texto
    copiarTexto.select()
    copiarTexto.setSelectionRange(0, 999999)// --> para mobile

    //copiar 
    navigator.clipboard.writeText(copiarTexto.value)
    //tirar o select
    if(window.getSelection){
        if(window.getSelection().empty){ // pro chrome
            window.getSelection().empty()
        } else if(window.getSelection().removeAllRanges){  // pro firefox
                window.getSelection().removeAllRanges()
        }
        
    }
    //remover o foco de tudo    
    document.activeElement.blur()
    //alert avisando
    setTimeout(() => {
       alert("Copiado para a área de transferência") 
    }, 10);

} 
//copiar fone
function CopiarPhone(){
    const copiarTexto = document.getElementById("copiarP")

    //selecionar o texto
    copiarTexto.select()
    copiarTexto.setSelectionRange(0, 999999)// --> para mobile

    //copiar 
    navigator.clipboard.writeText(copiarTexto.value)
    //tirar o select
    if(window.getSelection){
        if(window.getSelection().empty){
            window.getSelection().empty()
        } else if(window.getSelection().removeAllRanges){
            window.getSelection().removeAllRanges()
        }
    }
    //tirar o foco de tudo
    document.activeElement.blur()
    //alert avisando
    setTimeout(() => {
        alert("Copiado para a área de transferência") 
    }, 10);
} 


//parte de FAQ
function toggleFAQ(element) {
    const answer = element.nextElementSibling
    const isActive = element.classList.contains('active')

    if(!isActive){
        //abrir
        answer.classList.toggle('show')
        answer.style.maxHeight = answer.scrollheight + 'px'

    } else{
        //fechar
        answer.style.maxHeight = '0'

        setTimeout(() => {
           answer.classList.remove('show') 
        }, 100);
    }

}
