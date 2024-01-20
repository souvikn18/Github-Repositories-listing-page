// grabbing all variables from document
const input1 = document.getElementById("input1")
const loader = document.getElementById("loading")
const fullName = document.getElementById("name")
const avtar = document.getElementById("avtar")
const linkIcon = document.getElementById("link-svg")
const gitURL = document.getElementById("giturl")
const bio = document.getElementById("bio")
const city = document.getElementById("location")
const locIcon = document.getElementById("loc-svg")
const twitterURL = document.getElementById("twitterURL")
const twitterTag = document.getElementById("twitterTag")
const repoList = document.getElementById("repo-list");
const userDetails = document.querySelector(".user");


//creating loading spinner function for displaying
const displayLoading = () => {
    loader.classList.add("display");
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

//creating loading spinner function for hiding
const hideLoading = () => {
    loader.classList.remove("display");
}

// fetching data from API
const fetchDetails = async (event) => {
    event.preventDefault()
    repoList.innerHTML = ""

    // if user tries to find empty search box
    if (!input1.value) {
        alert("Searchbox is EMPTY!")
        return;
    }
    
    const userName = input1.value
    try {
        displayLoading()
        const response = await fetch(`https://api.github.com/users/${userName}`)        //API calling
        const allData = await response.json();                                          //storing the response in json format
        console.log(allData);
        input1.value = ""
        hideLoading()
        userDetails.style.opacity = 100;                // for some outline issue

        // assigning all datas from API
        avtar.src = allData.avatar_url
        if (allData.html_url) {
            linkIcon.src = "./assets/link.svg"
            gitURL.innerHTML = allData.html_url
            gitURL.href = allData.html_url
        }
        if (!allData.html_url) {
            alert("Invalid username :(")
            userDetails.innerHTML = ''
            repoList.innerHTML = ''
        }
        fullName.innerText = allData.name
        if (!allData.bio) {
            bio.innerHTML = ''
        }
        bio.innerText = allData.bio;

        if (allData.location === null) {
            locIcon.src = ""
        } else {
            locIcon.src = "./assets/location.svg"
        }

        city.innerHTML = allData.location
        
        if (allData.twitter_username === null) {
            twitterTag.innerHTML = ""
            twitterURL.innerHTML = ""
            twitterURL.href = ``
        } else {
            const twId = allData.twitter_username
            twitterTag.innerHTML = "Twitter:"
            twitterURL.innerText = `https://twitter.com/${twId}`
            twitterURL.href = `https://twitter.com/${twId}`
        }

        // storing user's repo url
        const repoURL = allData.repos_url

        try {
            const reposResponse = await fetch(repoURL)              // API call based on user's repo url
            const allRepos = await reposResponse.json()             // storing all repos in json format
            console.log(allRepos);

            // displaying all repos dynamically 
            allRepos.map(repo => {
                let repoCard = document.createElement("div")
                repoCard.classList.add("repocard")
                let repoName = document.createElement("h3")
                let repoDesc = document.createElement("p")
                let repoLang = document.createElement("p")
                repoLang.classList.add("repolang")
                repoName.classList.add("repos")
                repoName.innerHTML = repo.name
                repoDesc.innerHTML = repo.description
                repoLang.innerHTML = repo.language
                repoList.appendChild(repoCard)
                repoCard.appendChild(repoName)
                repoCard.appendChild(repoDesc)
                if (repo.language === null) {
                    repoLang.remove()
                } else {
                    repoCard.appendChild(repoLang)
                }
                
            })
            
        } catch (error) {
            console.error(error)
        }

    } catch (error) {
        console.error(error)
    }
}

userDetails.style.opacity = 0               // for some outline issue
