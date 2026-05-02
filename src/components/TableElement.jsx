import {Td, Tooltip, Text, Box} from "@chakra-ui/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

const TableElement = ({name, artist, scrobbles, imageLarge, imageSmall, showChartModal, setChartDetails, year}) => {
    const HandleClick = () => {
        setChartDetails({
            albumName: name,
            artistName: artist,
            year: year
        })
        showChartModal()
    }
    return (
        <Tooltip textAlign={'center'}  label={
            <>
                {name} - {artist}
                <br/>
                <strong>{scrobbles} {scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
            </>
        } placement={'bottom'} hasArrow={true}>
            <Td textAlign={'center'} p={0} onClick={() => { HandleClick() }} cursor={'pointer'}>
                {
                    //Check if image link is empty or does not exist
                    imageLarge === undefined || imageLarge === "" ?
                        <Box className={'image-container'} style={{overflow: 'hidden'}}>
                            <LazyLoadImage
                                src={'https://lastfm.freetls.fastly.net/i/u/300x300/32f2b94ebebb2742709006790b9209b9.png'}
                                effect={'black-and-white'}
                                wrapperProps={{ style: { display: 'block' } }}
                            />
                            <Text className={'overlay-text'} fontSize={'xs'} isTruncated>
                                {name}<br/><strong>{artist}</strong>
                            </Text>
                        </Box>
                        :
                        <Box>
                            <LazyLoadImage
                                placeholderSrc={imageSmall || undefined}
                                src={imageLarge}
                                effect={'black-and-white'}
                                wrapperProps={{ style: { display: 'block' } }}
                            />
                        </Box>
                }
            </Td>
        </Tooltip>
    )
}

export {TableElement}