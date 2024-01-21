import {Td, Tooltip, Text} from "@chakra-ui/react";

const TableElement = (props) => {
    return (
        <Tooltip textAlign={'center'} label={
            <>
                {props.name} - {props.artist}
                <br/>
                <strong>{props.scrobbles} {props.scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
            </>
        } placement={'bottom'} hasArrow={true}>
            <Td textAlign={'center'} p={0}>
                <a target={'_blank'} href={props.url} rel="noreferrer">
                    {
                        props.imageLarge === undefined || props.imageLarge === "" ?
                            <div className={'image-container'} style={{overflow: 'hidden'}}>
                                <img src={'https://lastfm.freetls.fastly.net/i/u/300x300/32f2b94ebebb2742709006790b9209b9.png'}/>
                                <Text className={'overlay-text'} fontSize={'xs'} isTruncated>
                                    {props.name}<br/><strong>{props.artist}</strong>
                                </Text>
                            </div>
                            :
                            <div>
                                <img src={props.imageLarge}/>
                            </div>
                    }
                </a>
            </Td>
        </Tooltip>
    )
}

export {TableElement}