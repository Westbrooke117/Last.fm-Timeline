import * as htmlToImage from "html-to-image";

const ComponentImageExport = ({ref, component, username, year, month}) => {
    if (ref) {
        let options;
        switch (component){
            case 'album-grid':
                options = {
                    style: {
                        borderRadius: 0
                    },
                    canvasWidth: 1200,
                    canvasHeight: 1200
                }

                htmlToImage.toPng(ref, options)
                    .then(function (dataUrl) {
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = `${username}_${year}_${month.toString().padStart(2,'0')}`;
                        link.click();
                    })
                    .catch(function (error) {
                        console.error('Oops, something went wrong!', error);
                    });
                break;
            case 'mini-timeline':
                options = {
                    style: {
                        width: 'fit-content',
                        borderRadius: 0
                    },
                    pixelRatio: 2,
                }

                htmlToImage.toPng(ref, options)
                    .then(function (dataUrl) {
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = `${username}_${year}`;
                        link.click();
                    })
                    .catch(function (error) {
                        console.error('Oops, something went wrong!', error);
                    });
                break;
        }
    }
};

export { ComponentImageExport }