const navigateTo = url => {
    history.pushState(null,null,url);
    router();
};

const router = async () => {
const routes =[
{ path: "/", view: () => console.log("Viewing dashboard")},
{ path: "/posts", view: () => console.log("Posts")},
{ path:"/settings", view:() => console.log("Settings") },

];

const potentialMatches = routes.map( route => {
return{
    route: route,
    isMatch: location.pathname === route.path
};
});

let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

if(!match){
    match = {
        route: routes[0],
        isMatch: true
    };
};

};

window.addEventListener("popstate",router);

document.addEventListener("DOMContentLoaded", () => {
document.body.addEventListener("click", e => {
    if(e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
})

router();
});