let newMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().toLocaleTimeString('nl-BE' , {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
};

let newLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: new Date().toLocaleTimeString()
    }
}

module.exports = {newMessage, newLocationMessage};