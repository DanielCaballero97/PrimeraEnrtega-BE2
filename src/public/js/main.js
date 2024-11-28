const prevButton = document.getElementById("prev-button")
const nextButton = document.getElementById("next-button")

prevButton.addEventListener("click",()=>{
    const dataPage = prevButton.getAttribute('data-page')
    if (dataPage) {
        window.location.href = `${dataPage}`
    }
})

nextButton.addEventListener("click",()=>{
    const dataPage = nextButton.getAttribute('data-page')
    if (dataPage) {
        window.location.href = `${dataPage}`
    }
})