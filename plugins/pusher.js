import Pusher from 'pusher-js'

export default ({ app }, inject) => {
    const pusher = new Pusher('a7b6fc49959894662b08', {
        cluster: 'ap1',
        forceTLS: true
    })

    // Inject vào context, bạn sẽ dùng được qua this.$pusher hoặc app.$pusher
    inject('pusher', pusher)
}
