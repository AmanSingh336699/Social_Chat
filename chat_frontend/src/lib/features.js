import moment from "moment";

const fileFormat = (url = "") => {
    const fileExt = url.split(".").pop().toLowerCase()
    if(fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
        return "video"

    if(fileExt === "mp3" || fileExt === "wav") return "audio"
    if(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif")
        return "image"

    return "file"
}   

const transformImage = (url = "", width = 100) => {
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`)
    return newUrl
}

const getLast7Days = () => {
    const currentDate = moment()

    const last7Days = []
    for(let i = 0; i<7; i++){
        const dayDate = currentDate.clone().subtract(i, "days")
        const dayName = dayDate.format("dddd");
        last7Days.unshift(dayName)
    }
    return last7Days
}

const getOrSaveFromStorage = ({ key, value, get }) => {
    if(get){
        try {
            const storedValue = localStorage.getItem(key)
            if(!storedValue || storedValue === "undefined" || storedValue === "null")
                return null
    
            return JSON.parse(storedValue)
        } catch (error) {
            console.error(`Error parsing data from localstorage for key ${key}:`, error)
            return null
        }
    } else {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error saving data to localstorage for key ${key}:`, error)
        }
    }
}

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };