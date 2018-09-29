import * as React from 'react';
import { ImgurAlbumData } from '../../../../../utils/imgur';
import { ListGroupItem } from 'reactstrap';
import { Album } from '../../../../../utils/images';
import './styles.css';

export interface AlbumProps {
    album: Album;
    onClick: (selected: boolean) => void;
    selected: boolean;
}

export default function AlbumComponent({ album, 
    onClick, selected }: AlbumProps) {
    const thumbnail = album.getThumbnailUrl();

    // This should probably be more sophisticated
    const isDriveGallery = !album.data;
    
    let subFolders = [];

    if (isDriveGallery) {
        // Have to figure out the type and attach a folders array to the album
        subFolders = (album as any).folders;

        // For now:
        subFolders = someTemporaryObject.map((folder: any) => {
            return (
                <ListGroupItem key={folder.name} active={selected} onClick={() => onClick(!selected)}>
                    <div className="album-container">
                        <div className="album-container--right" >
                            <h4>{folder.name}</h4>
                        </div>
                    </div>
                </ListGroupItem>
            );
        });
    }

    return (
        <div>
            <ListGroupItem active={selected} onClick={() => onClick(!selected)}>
                <div className="album-container">
                    <div className="album-container--left album-preview" >
                        <img src={thumbnail.toString()} />
                    </div>
                    <div className="album-container--right" >
                        <h4>{album.getTitle()}</h4>
                        <span>{album.getImages().length} images</span>
                    </div>
                </div>
            </ListGroupItem>
            {subFolders}
        </div>
    );
}

const someTemporaryObject = JSON.parse('[{"id":"1U7wWNPwlc5mW0Lx-mxbq-ZliePvASeH_","name":"Aaron_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1U7wWNPwlc5mW0Lx-mxbq-ZliePvASeH_","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"1YPnAOBoWxz3n2dfSQldH6J3S_y2K6Ady","name":"Marcia_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1YPnAOBoWxz3n2dfSQldH6J3S_y2K6Ady","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"1Z0lhPn964Yl5TDfdvVeBFmJgG11IAcBr","name":"Yoni_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1Z0lhPn964Yl5TDfdvVeBFmJgG11IAcBr","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"12RMdbVb1DcIPENXjkG_8NhXXUNYIluXN","name":"Chanon_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/12RMdbVb1DcIPENXjkG_8NhXXUNYIluXN","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"1ATp1RRbmhgFtoSpFLjuqieWYZq9n-4TB","name":"Veronica_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1ATp1RRbmhgFtoSpFLjuqieWYZq9n-4TB","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"1XZBRxvQ9Ah7cmCR7KV3E3-4-tjkUG2wU","name":"Mallory_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1XZBRxvQ9Ah7cmCR7KV3E3-4-tjkUG2wU","createdTime":"2018-09-27T03:51:23.616Z"},{"id":"1N1FF3SKMLkuywOGI-ALW7WwyoY5P55vr","name":"Hands_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1N1FF3SKMLkuywOGI-ALW7WwyoY5P55vr","createdTime":"2018-09-25T23:22:00.940Z"},{"id":"1-SCU1U3r256x1WXpivkD0mzvOl0_b0Vb","name":"Arms","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1-SCU1U3r256x1WXpivkD0mzvOl0_b0Vb","createdTime":"2018-09-20T03:06:25.780Z"},{"id":"1Sjfz1mG_RIoZcMHbrmZabQOykXn8cIdB","name":"Sekaa_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1Sjfz1mG_RIoZcMHbrmZabQOykXn8cIdB","createdTime":"2018-09-19T01:10:19.190Z"},{"id":"1_k7z25xRfD4VOIzR6cbfeb-5_Xsa0SVG","name":"Laura_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1_k7z25xRfD4VOIzR6cbfeb-5_Xsa0SVG","createdTime":"2018-09-19T01:10:05.655Z"},{"id":"1tVGKb8KFpHX84l7DY88AGM1GKNV8MKOb","name":"Anthony_Large","mimeType":"application/vnd.google-apps.folder","webViewLink":"https://drive.google.com/drive/folders/1tVGKb8KFpHX84l7DY88AGM1GKNV8MKOb","createdTime":"2018-09-18T23:23:51.972Z"}]');