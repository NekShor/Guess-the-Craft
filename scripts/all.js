
function do_sound (sound) {
    var audio = new Audio(`sounds/${sound}.mp3`);
    audio.play();
}