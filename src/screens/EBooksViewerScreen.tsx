import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pdf from "react-native-pdf";
import { getUserFolder, getUserStorageKey } from "../utils/userStorage";
import api from "../services/api";

interface DownloadedBook {
  bookId: string;
  title: string;
  localUri: string;
}

const { width, height } = Dimensions.get("window");

export function EBooksViewerScreen({ route, navigation }: any) {

  const { topic, pdfUrl, bookId } = route.params;

  const [loading, setLoading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState<string | null>(null);

  const pdfRef = useRef<any>(null);
  const downloadRef = useRef<any>(null);

  /* =============================
     AUTO CANCEL ON BACK
  ============================= */

  useEffect(() => {

    const unsubscribe = navigation.addListener("beforeRemove", async () => {

      if (loading) {
        await cancelDownload();
      }

    });

    return unsubscribe;

  }, [loading]);

  /* =============================
     CANCEL DOWNLOAD (PAUSE)
  ============================= */

  async function cancelDownload() {

    if (!downloadRef.current) return;

    try {

      const state = await downloadRef.current.pauseAsync();

      if (state?.resumeData) {
        setResumeData(state.resumeData);
      }

    } catch (err) {

      console.log("Cancel error:", err);

    }

    downloadRef.current = null;
    setLoading(false);

  }

  /* =============================
     CHECK DOWNLOAD STATUS
  ============================= */

  useEffect(() => {
    checkDownload();
  }, []);

  async function checkDownload() {

    const storageKey = await getUserStorageKey("downloadedBooks");
    const data = await AsyncStorage.getItem(storageKey);

    if (!data) return;

    const parsed = JSON.parse(data);
    const exists = parsed.some((b:any)=>b.bookId===bookId);

    if (!exists) return;

    const ebookFolder = await getUserFolder("ebooks");
    const fileUri = ebookFolder + `${bookId}.pdf`;

    const info = await FileSystem.getInfoAsync(fileUri);

    if (!info.exists || info.size < 50000) {
      setIsDownloaded(false);
      return;
    }

    setLocalUri(fileUri);
    setIsDownloaded(true);

  }

  /* =============================
     PREPARE FILE
  ============================= */

  async function prepareFile() {

    try {

      setLoading(true);
      setProgress(0);

      const ebookFolder = await getUserFolder("ebooks");
      const fileUri = ebookFolder + `${bookId}.pdf`;

      const info = await FileSystem.getInfoAsync(fileUri);

      if (info.exists && info.size && info.size > 50000) {

        setLocalUri(fileUri);
        setIsDownloaded(true);
        setLoading(false);
        return;

      }

      await downloadFile(fileUri);

    } catch (err) {

      console.log("Prepare error:", err);
      setLoading(false);

    }

  }

  /* =============================
     DOWNLOAD / RESUME FILE
  ============================= */

  async function downloadFile(fileUri:string) {

    try {

      let downloadResumable;

      if (resumeData) {

        downloadResumable = new FileSystem.DownloadResumable(
          pdfUrl,
          fileUri,
          {},
          handleProgress,
          resumeData
        );

      } else {

        downloadResumable = FileSystem.createDownloadResumable(
          pdfUrl,
          fileUri,
          {},
          handleProgress
        );

      }

      downloadRef.current = downloadResumable;

      const result = resumeData
        ? await downloadResumable.resumeAsync()
        : await downloadResumable.downloadAsync();

      if (result?.uri) {

        const info = await FileSystem.getInfoAsync(result.uri);

        if (info.exists && info.size && info.size > 50000) {

          await saveDownloadedBook(result.uri);

          setLocalUri(result.uri);
          setIsDownloaded(true);

        }

      }

    } catch (err) {

      console.log("Download error:", err);

    } finally {

      downloadRef.current = null;
      setResumeData(null);
      setLoading(false);

    }

  }

  function handleProgress(downloadProgress:any){

    const percent =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;

    setProgress(Math.floor(percent * 100));

  }

  /* =============================
     SAVE DOWNLOAD
  ============================= */

  async function saveDownloadedBook(fileUri:string){

    const storageKey = await getUserStorageKey("downloadedBooks");

    const existing = await AsyncStorage.getItem(storageKey);

    const parsed:DownloadedBook[] =
      existing ? JSON.parse(existing) : [];

    const exists = parsed.find((b)=>b.bookId===bookId);

    if (!exists){

      parsed.push({
        bookId,
        title:topic,
        localUri:fileUri
      });

      await AsyncStorage.setItem(storageKey, JSON.stringify(parsed));

    }

    try {

      await api.post("/users/downloads",{
        contentId:bookId,
        title:topic,
        type:"ebook"
      });

    } catch {}

  }

  /* =============================
     PAGE MEMORY
  ============================= */

  async function saveLastPage(page:number){

    const key = await getUserStorageKey(`book_page_${bookId}`);
    await AsyncStorage.setItem(key,page.toString());

  }

  async function restoreLastPage(total:number){

    const key = await getUserStorageKey(`book_page_${bookId}`);
    const saved = await AsyncStorage.getItem(key);

    if (!saved) return;

    const page = parseInt(saved,10);

    if(page>=1 && page<=total){

      setCurrentPage(page);

      setTimeout(()=>{
        pdfRef.current?.setPage(page);
      },500);

    }

  }

  /* =============================
     UI
  ============================= */

  return(

<View style={styles.container}>

<View style={styles.header}>

<TouchableOpacity
style={styles.iconButton}
onPress={()=>navigation.goBack()}
>
<Ionicons name="arrow-back-outline" size={22} color="#0F172A"/>
</TouchableOpacity>

<Text style={styles.headerTitle} numberOfLines={1}>
{topic}
</Text>

<View style={styles.iconButton}/>

</View>

{!isDownloaded && (

<View style={styles.downloadContainer}>

{loading ? (

<>

<ActivityIndicator size="large" color="#2563EB"/>

<Text style={{marginTop:10}}>
Downloading... {progress}%
</Text>

<View style={styles.progressBarBackground}>
<View
style={[
styles.progressBarFill,
{width:`${progress}%`}
]}
/>
</View>

<TouchableOpacity
style={styles.cancelButton}
onPress={cancelDownload}
>
<Ionicons name="close-circle-outline" size={18} color="white"/>
<Text style={styles.cancelText}>
Cancel Download
</Text>
</TouchableOpacity>

</>

) : (

<>

<Ionicons name="cloud-download-outline" size={70} color="#2563EB"/>

<Text style={styles.downloadText}>
Download this ebook to read offline
</Text>

<TouchableOpacity
style={styles.downloadButton}
onPress={prepareFile}
>
<Text style={{color:"white",fontWeight:"600"}}>
{resumeData ? "Resume Download" : "Download Ebook"}
</Text>
</TouchableOpacity>

</>

)}

</View>

)}

{!loading && isDownloaded && localUri && (

<Pdf
ref={pdfRef}
source={{uri:localUri}}
style={styles.pdf}
onLoadComplete={(pages)=>restoreLastPage(pages)}
onPageChanged={(page)=>{
setCurrentPage(page);
saveLastPage(page);
}}
/>

)}

</View>

);

}

const styles = StyleSheet.create({

container:{flex:1,backgroundColor:"#F8FAFC"},

header:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:15,
paddingVertical:12,
backgroundColor:"white",
borderBottomWidth:1,
borderColor:"#E2E8F0"
},

iconButton:{
width:36,
height:36,
borderRadius:10,
backgroundColor:"#F8FAFC",
justifyContent:"center",
alignItems:"center"
},

headerTitle:{
flex:1,
textAlign:"center",
fontSize:15,
fontWeight:"600",
color:"#0F172A"
},

pdf:{flex:1,width:width,height:height},

downloadContainer:{
flex:1,
justifyContent:"center",
alignItems:"center",
padding:20
},

downloadText:{
fontSize:16,
marginTop:15,
marginBottom:20,
color:"#334155"
},

downloadButton:{
backgroundColor:"#2563EB",
paddingVertical:12,
paddingHorizontal:30,
borderRadius:10
},

progressBarBackground:{
width:"80%",
height:8,
backgroundColor:"#E2E8F0",
borderRadius:10,
marginTop:15
},

progressBarFill:{
height:8,
backgroundColor:"#2563EB",
borderRadius:10
},

cancelButton:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#EF4444",
paddingVertical:10,
paddingHorizontal:20,
borderRadius:10,
marginTop:20,
gap:6
},

cancelText:{
color:"white",
fontWeight:"600"
}

});