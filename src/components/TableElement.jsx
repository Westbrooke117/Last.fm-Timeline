import {Td, Tooltip, Text} from "@chakra-ui/react";

const TableElement = ({name, artist, scrobbles, imageLarge, url}) => {
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
                        <div className={'image-container'} style={{overflow: 'hidden'}}>
                            <img src={'https://lastfm.freetls.fastly.net/i/u/300x300/32f2b94ebebb2742709006790b9209b9.png'}/>
                            <Text className={'overlay-text'} fontSize={'xs'} isTruncated>
                                {name}<br/><strong>{artist}</strong>
                            </Text>
                        </div>
                        :
                        <div>
                            <img src={imageLarge}/>
                        </div>
                }
            </Td>
        </Tooltip>
    )
}

export {TableElement}