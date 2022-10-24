import { loadTheme, toggleTheme } from "./theme.js";
import jsmediatags from "./tagReader.js"

const themeBtn = document.getElementById("toggle-theme")
const musicContainer = document.querySelector('.music-container')
const playBtn = document.querySelector('.play')
const prevBtn = document.querySelector('.prev')
const nextBtn = document.querySelector('.next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
let songData = {}

themeBtn.addEventListener("click", toggleTheme)


// Song titles
const songs =['test2', 'test3'] //This has to be dynamic!

// Keep track of songs
let songIndex = 0

// Load song info into DOM
loadSong(songs[songIndex])

// Update song details
function loadSong(song){
    audio.src = `../audiotest/${song}.mp3`
}

function playSong(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')

    loadTags()
    audio.play()
}
function pauseSong(){
    musicContainer.classList.remove('play')
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')

    audio.pause()
}

function prevSong(){
    songIndex--

    if(songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong(songs[songIndex])
    playSong()
}

function nextSong(){
    songIndex++

    if(songIndex >= songs.length ){
        songIndex = 0
    }

    loadSong(songs[songIndex])
    playSong()
}

function updateProgress(e){
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}

function loadTags(){
    jsmediatags.read(audio.src, {
        onSuccess: function(tag){
            songData = tag

            const data = songData.tags.picture.data
            const format = songData.tags.picture.format
            let base64String = ""

            for(let i = 0; i < data.length; i++){
                base64String += String.fromCharCode(data[i])
            }
            document.getElementById("img-container").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`
            // document.getElementById("img-container").innerHTML = `<img class="song-cover" src="data:${format};base64,${window.btoa(base64String)}" alt="">`
            document.getElementById("song-title").textContent = songData.tags.title
            document.getElementById("album").textContent = songData.tags.album
            document.getElementById("artist").textContent = songData.tags.artist
            
        },
        onError: function(error){
            console.log(error)
        }
    })

    
}

// Event listeners
playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying){
        pauseSong()
    } else {
        playSong()
    }
})

// Change songs

prevBtn.addEventListener("click", prevSong)
nextBtn.addEventListener("click", nextSong)

audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)

loadTheme()