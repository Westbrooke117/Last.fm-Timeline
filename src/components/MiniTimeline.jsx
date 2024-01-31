import {HStack, VStack, Image, Tag, Tooltip, Link, Collapse, Button, StackDivider} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {EditIcon, SettingsIcon} from "@chakra-ui/icons";

const MiniTimeline = (props) => {
    const miniTimelineRef = useRef(null)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [collapseVisible, toggleCollapseVisible] = useState(false)

    return (
        <div style={{marginTop: 50}}>
            <div style={{display:'flex', flexDirection: 'row-reverse', justifyContent:'center'}}>
                <HStack backgroundColor={backgroundColor} maxW={'fit-content'} p={2} ref={miniTimelineRef} borderRadius={10}>
                    <VStack>
                        <p>#</p>
                        <Tag textAlign={'center'} color={'gray.800'} w={10} h={106} backgroundColor={'#ffd700'}><strong>1st</strong></Tag>
                        <Tag textAlign={'center'} color={'gray.800'} w={10} h={106} backgroundColor={'silver'}><strong>2nd</strong></Tag>
                        <Tag textAlign={'center'} w={10} h={106} backgroundColor={'#CD7F32'}><strong>3rd</strong></Tag>
                        <Tag textAlign={'center'} w={10} h={106}>4th</Tag>
                        <Tag textAlign={'center'} w={10} h={106}>5th</Tag>
                    </VStack>
                    {props.data.map((month) => (
                        <VStack key={month.id}>
                            <p>{month.monthText}</p>
                            {month.albums && month.albums.length > 0 ? (
                                month.albums.map((album, index) => (
                                    <Tooltip textAlign={'center'} label={
                                        <>
                                            {album.name} - {album.artist}
                                            <br/>
                                            <strong>{album.scrobbles} {album.scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
                                        </>
                                    } placement={'bottom'} hasArrow={true}>
                                        <Image
                                            h={106}
                                            alt={album.name}
                                            key={index}
                                            borderRadius={5}
                                            src={album.image}
                                        />
                                    </Tooltip>
                                ))
                            ) : (
                                <p>No albums available for this month</p>
                            )}
                        </VStack>
                    ))}
                </HStack>
            </div>
            <HStack justifyContent={'center'} alignItems={'center'} mt={3}>
                <Link onClick={() => props.saveAsImage(miniTimelineRef.current, undefined, undefined, 'mini-timeline')} color={'gray.500'} textAlign={'center'}>Save as Image</Link>
                <SettingsIcon cursor={'pointer'} className={'settings-icon'} color={'gray.500'} onClick={() => {toggleCollapseVisible(!collapseVisible)}}/>
            </HStack>
            <Collapse in={collapseVisible}>
                <HStack justifyContent={'center'} mt={3}>
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
                    <input className={'colorInput'} onClick={(e) => setBackgroundColor(e.target.value)} onChange={(e) => setBackgroundColor(e.target.value)} type={'color'}/>
                </HStack>
            </Collapse>
        </div>
    );
};

export { MiniTimeline };