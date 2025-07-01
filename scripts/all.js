
function do_sound (sound) {
    try{
        var audio = new Audio(`sounds/${sound}.mp3`);
        audio.play();
    } catch (e) {
    }
}