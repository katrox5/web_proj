class Image {
    constructor(target) {
        const id = 'image-container';
        this.container = document.getElementById(id);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = id;

            const header = document.createElement('div');
            header.className = 'header';

            this.funBtn = document.createElement('img');
            this.funBtn.src = '../../img/index/points.png';

            const clsBtn = document.createElement('img');
            clsBtn.src = '../../img/index/cancel.png';
            clsBtn.onclick = () => this.close();

            header.appendChild(clsBtn);
            header.appendChild(this.funBtn);

            const image = document.createElement('img');
            image.src = target.src;

            this.container.appendChild(header);
            this.container.appendChild(image);
        }
    }

    onclose;

    setFunction(func) {
        this.funBtn.onclick = () => func();
    }

    display() {
        document.body.appendChild(this.container);
    }

    close() {
        this.container.remove();
        this.onclose();
    }
}
