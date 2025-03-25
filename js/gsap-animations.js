document.addEventListener("DOMContentLoaded", iniciarGSAP)

function iniciarGSAP() {    
    gsap.registerPlugin(ScrollTrigger)

    gsap.from([".navbar__logo",".menu__item",], { 
        duration: .4, 
        y: 50, 
        opacity: 0, 
        ease: "power2.out",
        stagger: .2 ,
        delay: .3,
    })

    gsap.from(".tags__item",{
        opacity: 0, 
        pinSpacing: true, 
        duration: .4,        
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".tags__item",
            delay: 0,             
        }, 
        stagger: .2     
    })

    gsap.from(".recipe-card",{
        opacity: 0, 
        y: 50,
        duration: .8,        
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".recipe-card",
            start: "top 80%", 
            delay: 2,    
        }, 
    })
    /* gsap.from(".tags__item",{
        scrollTrigger: {
            trigger: ".tags__item",
            start: "top 80%", 
            end: "top 70%",
            // primer valor elemento (si es px, lo visible desde que entra al v.port), segundo valor viewport
            markers: true,
            toggleActions: "play none none none",
            scrub: 1, 
        }        
    }) */
}
