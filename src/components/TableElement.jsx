import {Td, Tooltip, Text, Box} from "@chakra-ui/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const TableElement = ({name, artist, scrobbles, imageLarge, imageSmall, url}) => {
    const HandleLink = (url) => {
        window.open(url, '_blank')
    }
    return (
        <Tooltip textAlign={'center'}  label={
            <>
                {name} - {artist}
                <br/>
                <strong>{scrobbles} {scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
            </>
        } placement={'bottom'} hasArrow={true}>
            <Td textAlign={'center'} p={0} onClick={() => {HandleLink(url)}} cursor={'pointer'}>
                {
                    imageLarge === undefined || imageLarge === "" ?
                        <Box className={'image-container'} style={{overflow: 'hidden'}}>
                            <LazyLoadImage
                                src={'https://lastfm.freetls.fastly.net/i/u/300x300/32f2b94ebebb2742709006790b9209b9.png'}
                                effect={'blur'}
                            />
                            <Text className={'overlay-text'} fontSize={'xs'} isTruncated>
                                {name}<br/><strong>{artist}</strong>
                            </Text>
                        </Box>
                        :
                        //Hard-coded max height of an image. Removing this adds a small margin beneath each image for some reason.
                        <Box maxH={'168.967px'}>
                            <LazyLoadImage
                                placeholderSrc={imageSmall}
                                src={imageLarge}
                                effect={'blur'}
                            />
                        </Box>
                }
            </Td>
        </Tooltip>
    )
}

export {TableElement}