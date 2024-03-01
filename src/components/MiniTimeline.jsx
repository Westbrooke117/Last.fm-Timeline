import {HStack, VStack, Image, Tag, Tooltip, Link, Button, StackDivider, Box, Text, LinkBox} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {EditIcon} from "@chakra-ui/icons";

const MiniTimeline = (props) => {
    const miniTimelineRef = useRef(null)
    const [backgroundColor, setBackgroundColor] = useState('gray.800')
    const [customBackgroundColor, setCustomBackgroundColor] = useState(null)

    const HandleImageClick = (url) => {
        window.open(url, '_blank')
    }

    return (
        <div style={{marginTop: 50}}>
            <div style={{display:'flex', flexDirection: 'row-reverse', justifyContent:'center'}}>
                <HStack backgroundColor={backgroundColor} maxW={'fit-content'} p={2} ref={miniTimelineRef} borderRadius={10}>
                    <VStack>
                        <p> </p>
                        <Tag textAlign={'center'} color={'gray.800'} w={10} h={104.667} backgroundColor={'#ffd700'}><strong>1st</strong></Tag>
                        <Tag textAlign={'center'} color={'gray.800'} w={10} h={104.667} backgroundColor={'silver'}><strong>2nd</strong></Tag>
                        <Tag textAlign={'center'} w={10} h={104.667} backgroundColor={'#CD7F32'}><strong>3rd</strong></Tag>
                        <Tag textAlign={'center'} w={10} h={104.667}>4th</Tag>
                        <Tag textAlign={'center'} w={10} h={104.667}>5th</Tag>
                    </VStack>
                    {props.data.map((month) => (
                        <VStack key={month.id}>
                            <p>{month.monthText}</p>
                            {month.albums && month.albums.length > 0 ? (
                                month.albums.slice(0, 5).map((album, index) => (
                                    <Tooltip key={index} textAlign={'center'} label={
                                        album ? (
                                            <>
                                                {album.name} - {album.artist}
                                                <br />
                                                <strong>{album.scrobbles} {album.scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
                                            </>
                                        ) : "No album available"
                                    } placement={'bottom'} hasArrow={true}>
                                        <Box onClick={() => HandleImageClick(album.url)} cursor={'pointer'}>
                                            {album ? (
                                                album.image === undefined || album.image === "" ?
                                                    <Box className={'image-container'} overflow={'hidden'} maxH={104.667} maxW={104.667} borderRadius={5}>
                                                        <Image src={'https://lastfm.freetls.fastly.net/i/u/300x300/32f2b94ebebb2742709006790b9209b9.png'}/>
                                                        <Text className={'mini-overlay-text'} fontSize={'10px'} isTruncated>
                                                            {album.name}<br/><strong>{album.artist}</strong>
                                                        </Text>
                                                    </Box>
                                                    :
                                                    <Box>
                                                        <Image
                                                            src={album.image}
                                                            maxH={104.667}
                                                            key={index}
                                                            borderRadius={5}
                                                        />
                                                    </Box>
                                            ) : (
                                                <Box w={104.667} h={104.667} />
                                            )}
                                        </Box>
                                    </Tooltip>
                                )).concat(Array(Math.max(5 - month.albums.length, 0)).fill(null).map((_, index) => (
                                    <Box key={index} w={104.667} h={104.667} />
                                )))
                            ) : (
                                Array(5).fill(null).map((_, index) => (
                                    <Box key={index} w={104.667} h={104.667}></Box>
                                ))
                            )}
                        </VStack>
                    ))}
                </HStack>
            </div>
            <HStack justifyContent={'center'} alignItems={'center'} mt={3}>
                <Link onClick={() => props.saveAsImage(
                    miniTimelineRef.current,
                    props.user,
                    props.year,
                    undefined,
                    'mini-timeline'
                )} color={'gray.500'} textAlign={'center'}>Save as Image</Link>
            </HStack>
            <HStack justifyContent={'center'} mt={4}>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('gray.800')} backgroundColor={'gray.800'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#664d00')} backgroundColor={'#664d00'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#6e2a0c')} backgroundColor={'#6e2a0c'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#691312')} backgroundColor={'#691312'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#5d0933')} backgroundColor={'#5d0933'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#291938')} backgroundColor={'#291938'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#042d3a')} backgroundColor={'#042d3a'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#12403c')} backgroundColor={'#12403c'} borderRadius={20}></Button>
                <Button border={'1px solid #3f444e'} variant={'unstyled'} onClick={() => setBackgroundColor('#475200')} backgroundColor={'#475200'} borderRadius={20}></Button>
                <StackDivider/>
                <EditIcon color={'#718096'}/>
                <Box className={'colorInputWrapper'} backgroundColor={customBackgroundColor} border={'1px solid #3f444e'} w={10} h={10} borderRadius={20} cursor={'pointer'}>
                    <input className={'colorInput'} onClick={(e) => {
                        setBackgroundColor(e.target.value)
                        setCustomeBackgroundColor(e.target.value)
                    }} onChange={(e) => {
                        setBackgroundColor(e.target.value)
                        setCustomBackgroundColor(e.target.value)
                    }} type={'color'}/>
                </Box>
                {/**/}
            </HStack>
        </div>
    );
};

export { MiniTimeline };