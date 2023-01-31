const creatingLinkDivFromLinks = (o_link,n_link) => {
  let api_link_div = document.createElement("div");
  let old_link = document.createElement("span");
  let new_link_section = document.createElement("section");
  let new_link = document.createElement("p");
  let copy_button = document.createElement("button");

  api_link_div.classList.add("api_link_div");
  old_link.classList.add("old_link");
  new_link.classList.add("new_link");
  copy_button.innerText = "Copy";

  new_link.innerHTML = n_link;
  old_link.innerHTML = o_link;

  copy_button.addEventListener("click", () => {
    copy_button.style.backgroundColor = "#3A3053";
    copy_button.innerHTML = "Copied!";

    setTimeout(() => {
      copy_button.style.backgroundColor = "#2AD0D2";
      copy_button.innerHTML = "Copy";
    }, 4000);

    console.log(new_link.innerHTML);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(new_link.innerHTML);
    } else {
      let input = document.createElement("input");
      input.value = new_link.innerHTML;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  });

  document.getElementById("link_input_field_id").value = "";

  new_link_section.appendChild(new_link);
  new_link_section.appendChild(copy_button);

  api_link_div.appendChild(old_link);
  api_link_div.appendChild(new_link_section);

  document.querySelector(".shorten_api_links").prepend(api_link_div);
};


list_of_links = JSON.parse(localStorage.getItem("links"));
if (list_of_links === null ){
  list_of_links = [];
}else{
  for (i of list_of_links){
    creatingLinkDivFromLinks(i[0],i[1])
  }
}
localStorage.setItem("links", JSON.stringify(list_of_links));

document
  .getElementById("menu_button_id")
  .addEventListener("click", function () {
    const element = document.querySelector(".logo_and_menu_div_mobile");
    const style = getComputedStyle(element);
    const display = style.getPropertyValue("display");

    if (display === "flex") {
      element.classList.remove("slide-down");
      element.classList.add("slide-up");
      setTimeout(() => {
        element.style.display = "none";
      }, 350);
    } else if (display === "none") {
      element.classList.remove("slide-up");
      element.classList.add("slide-down");
      element.style.display = "flex";
    }
  });

const changeDisplay = () => {
  if (window.innerWidth > 1000) {
    document.querySelector(".logo_and_menu_div_mobile").style.display = "none";
  }
};

window.onload = changeDisplay;
window.onresize = changeDisplay;

const getShortenLink = async (link) => {
  const encodedParams = new URLSearchParams();
  encodedParams.append("url", `${link}`);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "39ffbb42b8mshc588dccb504469fp1cef0ejsn6775f1fd1afa",
      "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
    },
    body: encodedParams,
  };

  let shorten_link;

  await fetch("https://url-shortener-service.p.rapidapi.com/shorten", options)
    .then((response) => response.json())
    .then((response) => (shorten_link = response))
    .catch((err) => console.error(err));

  return shorten_link["result_url"];
};

document
  .getElementById("shorten_it_button_id")
  .addEventListener("click", async () => {
    if (document.getElementById("link_input_field_id").value !== "") {

      let link_from_api;
      link_from_api = await getShortenLink(
        document.getElementById("link_input_field_id").value
      );
  
      
      list_of_links = JSON.parse(localStorage.getItem("links"));
      document.getElementById("link_input_field_id").style.border = "1px rgba(0, 0, 0, 0.429) solid"
      if (link_from_api === undefined) {
        document.getElementById("link_input_field_id").style.border = "2px rgb(226 13 13) solid"
        
        alert(
          "Somthing went wrong, please try again.\n\nPlease include the 'https://' at the start of your link and remove 'www' if it exists. \n\nFor example: 'https://google.com' "
        );
        console.clear();
      } else if (list_of_links.length < 3) {
        list_of_links.push([document.getElementById("link_input_field_id").value,link_from_api]);
        localStorage.setItem("links", JSON.stringify(list_of_links));

        creatingLinkDivFromLinks(document.getElementById("link_input_field_id").value,link_from_api)

      } else {
        alert(
          "We have a limit of 3 links per one use :) But no worries! We will delete the links for you."
        );
        list_of_links = [];
        localStorage.setItem("links", JSON.stringify(list_of_links));
        document.querySelector(".shorten_api_links").innerHTML = "";
      }
    } else {
      alert("Please type a link");
    }
  });




