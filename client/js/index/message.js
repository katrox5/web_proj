class Message {
    constructor() {
        const id = 'message-container';
        this.container = document.getElementById(id);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = id;
            document.body.appendChild(this.container);
        }
    }

    show({type = 'info', text = '', duration = 2000, closeable = false}) {
        let msg = document.createElement('div');
        msg.className = 'message move-in';
        msg.innerHTML = `
            <span class="icon icon-${type}"></span>
            <div class="text">${text}</div>
        `;
        if (closeable) {
            let cls = document.createElement('div');
            cls.className = 'close icon icon-close';
            msg.appendChild(cls);

            cls.addEventListener('click', () => {
                this.close(msg);
            });
        }

        this.container.appendChild(msg);

        if (duration > 0) {
            setTimeout(() => {
                this.close(msg);
            }, duration);
        }
    }

    close(msg) {
        msg.className = msg.className.replace('move-in', 'move-out');

        msg.addEventListener('animationend', () => {
            msg.setAttribute('style', 'height: 0; margin: 0;');
        });

        msg.addEventListener('animationend', () => {
            msg.remove();
        });
    }
}
