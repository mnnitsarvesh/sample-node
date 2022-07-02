const showSuccess = (message) => {
    $.toast({
        heading:'Success',
        text: message,
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 5000,
        allowToastClose: false,
        position: { left:1050, top: 30 }
    })
}

const showError = (message) => {
    $.toast({
        heading: 'Error',
        text: message,
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 5000,
        position: { left: 1050, top: 30 }
    })
}

const showWarning = (message) => {
    $.toast({
        heading: 'Warning',
        text: message,
        icon: 'warning',
        loader: false,
        hideAfter: false,
        allowToastClose: true,
        position: { left:1050, top: 30 }
    })
}

const showInfo = (message) => {
    $.toast({
        heading: 'Info',
        text: message,
        icon: 'info',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'slide',
        hideAfter: 5000,
        allowToastClose: false,
        position: { left:1050, top: 30 }
    })
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getDateWithoutTime = (date) => {
    date = new Date(date);
    if(!isNaN(date.getTime())){
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return day +' '+ monthNames[monthIndex] +' '+ year
    } else return '---';
}

const getDate = (date) => {
    date = new Date(date);
    if(!isNaN(date.getTime())){
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return day +'th '+ monthNames[monthIndex] +' '+ year +' '+ date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else return '---';
}
