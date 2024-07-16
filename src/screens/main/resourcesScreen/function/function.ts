import { supabase } from '../../../../initSupabase';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
export const fetchClasses = async (userId: any, user: any) => {
    try {
        // Fetch classes that the user is attending
        const { data: classData, error: classError } =
            user?.roleid == "1" ?
                await supabase
                    .from('classtutor')
                    .select('classid')
                    .eq('userid', userId)
                : await supabase
                    .from('classattendee')
                    .select('classid')
                    .eq('userid', userId);


        if (classError) {
            throw classError;
        }
        if (!classData || classData.length === 0) {
            return [];
        }

        // Extract class IDs that the user is attending
        const classIds = classData.map((entry: any) => entry.classid);

        const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select(`title, classid,
                class_resource(
                *
                )`)
            .in('classid', classIds)
            .order('classid', { ascending: true })
        if (classesError) {
            throw classesError;
        }

        return classesData || [];

    } catch (error: any) {
        console.error('Error fetching classes:', error.message);
        return [];
    }
}


export const handleFileDownload = async (url: string, fileName: string) => {
    try {
        const { data, error } = await supabase.storage
            .from('resource')
            .download(url);

        if (error) {
            console.error('Error downloading file:', error.message);
            return;
        }

        const fileUri = `${FileSystem.documentDirectory}${url}`;
        const mimeType = data?.type || 'application/octet-stream'; // Default MIME type if not available

        if (Platform.OS === 'web') {
            // For web platform, convert Blob to Base64 string
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                const link = document.createElement('a');
                link.href = base64data;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(data as Blob);
        } else {
            // For mobile platforms, use FileReader to read the Blob content
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result as string;

                await FileSystem.writeAsStringAsync(fileUri, base64data.split(',')[1], {
                    encoding: FileSystem.EncodingType.Base64,
                });

                if (Platform.OS === 'android') {
                    // Request storage permissions
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Permission required', 'Storage permission is required to save the file.');
                        return;
                    }

                    // Save file to Android's downloads directory
                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    const album = await MediaLibrary.getAlbumAsync('Download');
                    if (album == null) {
                        await MediaLibrary.createAlbumAsync('Download', asset, false);
                    } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }
                    console.log('File downloaded to the Downloads folder');
                } else {
                    // Use sharing for iOS
                    await Sharing.shareAsync(fileUri, {
                        mimeType: mimeType,
                        dialogTitle: 'Share the file',
                        UTI: getUTI(fileName),
                    });
                    console.log('File shared from:', fileUri);
                }
            };
            reader.readAsDataURL(data as Blob);
        }
    } catch (error) {
        console.error('Error handling download:', error);
    }
};

const getUTI = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'com.adobe.pdf';
        case 'doc':
            return 'com.microsoft.word.doc';
        case 'docx':
            return 'org.openxmlformats.wordprocessingml.document';
        case 'xls':
            return 'com.microsoft.excel.xls';
        case 'xlsx':
            return 'org.openxmlformats.spreadsheetml.sheet';
        default:
            return 'public.data';
    }
};
export const handleFileDelete = async (url: string, fileName: string, resourceId: string) => {
    console.log(url, fileName, resourceId);

    try {
        const { data, error } = await supabase
            .storage
            .from('resource')
            .remove([url]);

        if (error) {
            console.error('Error removing resource:', error.message);
        } else {
            console.log('resource removed successfully:', data);
        }
    } catch (error) {
        console.error('Error in remove resource:', error);
    }

    try {
        const { error } = await supabase
        .from('class_resource')
        .delete()
        .eq('resource_id', resourceId);
    
      if (error) {
        throw error;
      }
    } catch (error) {
        console.log(error)
    }
}

