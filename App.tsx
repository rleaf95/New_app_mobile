import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// テスト用GLBファイル
const MODEL_URLS = {
  // 最も軽量で確実
  astronaut: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  // 標準テストモデル
  duck: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
  // あなたのカスタムモデル
  custom: 'https://raw.githubusercontent.com/rleaf95/New_app_mobile/main/assets/models/robot.glb'
};

const createThreeJSHTML = (url: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Three.js 本体 -->
    <script src="https://unpkg.com/three@0.144.0/build/three.min.js"></script>
    <!-- GLTFLoader -->
    <script src="https://unpkg.com/three@0.144.0/examples/js/loaders/GLTFLoader.js"></script>
    <!-- OrbitControls -->
    <script src="https://unpkg.com/three@0.144.0/examples/js/controls/OrbitControls.js"></script>
    
    <style>
        body { margin: 0; overflow: hidden; background: transparent; }
        #container { width: 100vw; height: 100vh; }
        .status { 
            position: absolute; top: 50%; left: 50%; 
            transform: translate(-50%, -50%);
            color: white; font-size: 16px; 
            background: rgba(0,0,0,0.7); padding: 15px; border-radius: 10px;
        }
    </style>
</head>
<body>
    <div id="status" class="status">読み込み中...</div>
    <div id="container"></div>
    
    <script>
        window.addEventListener('load', function() {
            const container = document.getElementById('container');
            const status = document.getElementById('status');
            
            // Three.jsの確認
            if (typeof THREE === 'undefined') {
                status.textContent = 'Three.js読み込みエラー';
                return;
            }
            
            // 基本設定
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0); // 透明背景
            container.appendChild(renderer.domElement);
            
            // カメラ位置
            camera.position.set(0, 1, 3);
            
            // ライト
            const light = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(light);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(5, 5, 5);
            scene.add(dirLight);
            
            // コントロール
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2;
            
            // GLTFLoader
            const loader = new THREE.GLTFLoader();
            loader.load(
                '${url}',
                function(gltf) {
                    const model = gltf.scene;
                    
                    // サイズ正規化
                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const scale = 2 / size;
                    model.scale.multiplyScalar(scale);
                    
                    // 中央配置
                    const center = box.getCenter(new THREE.Vector3());
                    model.position.copy(center).multiplyScalar(-scale);
                    
                    scene.add(model);
                    status.style.display = 'none';
                    
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'MODEL_LOADED'
                    }));
                },
                function(progress) {
                    if (progress.lengthComputable) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        status.textContent = '読み込み中... ' + percent + '%';
                    }
                },
                function(error) {
                    status.textContent = '読み込みエラー';
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'MODEL_ERROR', error: error.message
                    }));
                }
            );
            
            // アニメーション
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
            
            // リサイズ対応
            window.addEventListener('resize', function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        });
    </script>
</body>
</html>`;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentModel, setCurrentModel] = useState<keyof typeof MODEL_URLS>('astronaut');
  const [debugInfo, setDebugInfo] = useState('Three.js 初期化中...');

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'DEBUG':
          console.log('🔍 Three.js:', data.message);
          setDebugInfo(data.message);
          break;
          
        case 'THREEJS_READY':
          console.log('✅ Three.js 準備完了');
          break;
          
        case 'THREEJS_ERROR':
          console.error('❌ Three.js エラー:', data.error);
          setHasError(true);
          setIsLoading(false);
          Alert.alert(
            'Three.js エラー',
            `3Dエンジンの初期化に失敗しました。\n\nエラー: ${data.error}`,
            [{ text: 'OK' }]
          );
          break;
          
        case 'MODEL_PROGRESS':
          console.log('📊 進捗:', data.progress + '%');
          break;
          
        case 'MODEL_LOADED':
          setIsLoading(false);
          setHasError(false);
          console.log('✅ 3Dモデル表示成功（Three.js直接）');
          break;
          
        case 'MODEL_ERROR':
          setIsLoading(false);
          setHasError(true);
          console.error('❌ モデルエラー:', data.error);
          Alert.alert(
            'モデル読み込みエラー',
            '3Dモデルファイルの読み込みに失敗しました。',
            [
              { text: 'キャンセル' },
              { text: '再試行', onPress: () => changeModel(currentModel) }
            ]
          );
          break;
          
        case 'TIMEOUT':
          setIsLoading(false);
          setHasError(true);
          console.error('⏰ タイムアウト（Three.js）');
          Alert.alert(
            'タイムアウト',
            'モデルの読み込みに時間がかかりすぎています。',
            [
              { text: 'キャンセル' },
              { text: '再試行', onPress: () => changeModel(currentModel) }
            ]
          );
          break;
          
        case 'JS_ERROR':
          console.error('💥 JavaScript エラー:', data.message);
          break;
      }
    } catch (error) {
      console.error('メッセージ解析エラー:', error);
    }
  };

  const changeModel = (modelKey: keyof typeof MODEL_URLS) => {
    console.log('🔄 モデル変更 (Three.js):', modelKey);
    setCurrentModel(modelKey);
    setIsLoading(true);
    setHasError(false);
    setDebugInfo('Three.js モデル変更中...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A5568" />
      
      <LinearGradient
        colors={['#2D3748', '#4A5568', '#718096']}
        style={styles.background}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#3182CE', '#2B6CB0']}
            style={styles.logo}
          >
            <Text style={styles.logoText}>DX</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>GLB Viewer (Three.js)</Text>
        </View>

        {/* デバッグ情報表示 */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText} numberOfLines={2}>
            {debugInfo}
          </Text>
        </View>

        {/* モデル選択ボタン */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.modelSelector}
          contentContainerStyle={styles.modelSelectorContent}
        >
          {Object.entries(MODEL_URLS).map(([key, url]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.modelButton,
                currentModel === key && styles.modelButtonActive
              ]}
              onPress={() => changeModel(key as keyof typeof MODEL_URLS)}
            >
              <Text style={[
                styles.modelButtonText,
                currentModel === key && styles.modelButtonTextActive
              ]}>
                {key.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3Dモデル表示エリア */}
        <View style={styles.modelContainer}>
          <WebView
            key={currentModel}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            style={styles.webview}
            source={{ html: createThreeJSHTML(MODEL_URLS[currentModel]) }}
            onMessage={handleWebViewMessage}
            onLoadStart={() => console.log('WebView読み込み開始 (Three.js)')}
            onLoadEnd={() => console.log('WebView読み込み完了 (Three.js)')}
            startInLoadingState={false}
            scrollEnabled={false}
            bounces={false}
            mixedContentMode="compatibility"
            allowsFullscreenVideo={false}
          />
          
          {/* ローディングオーバーレイ */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.loadingText}>3Dモデル読み込み中...</Text>
            </View>
          )}
          
          {/* エラー表示 */}
          {hasError && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>❌ 読み込みに失敗しました</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => changeModel(currentModel)}
              >
                <Text style={styles.retryButtonText}>再試行</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ログインカード */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign in as Staff</Text>
            <View style={styles.inputPlaceholder} />
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#3182CE', '#2B6CB0']}
                style={styles.buttonGradient}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign in as Owner</Text>
              <View style={styles.closeButton} />
            </View>
            <View style={styles.inputPlaceholder} />
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#3182CE', '#2B6CB0']}
                style={styles.buttonGradient}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.posSetup}>
          <Text style={styles.posText}>POS Terminal Setup</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  logo: {
    width: 70, height: 70, borderRadius: 35,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10
  },
  logoText: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, fontWeight: '500' },
  
  debugContainer: { 
    marginHorizontal: 20, marginVertical: 5, 
    backgroundColor: 'rgba(96, 165, 250, 0.2)', 
    borderRadius: 8, padding: 8 
  },
  debugText: { 
    color: '#60A5FA', fontSize: 11, fontFamily: 'monospace' 
  },
  
  modelSelector: { maxHeight: 50, marginVertical: 10 },
  modelSelectorContent: { paddingHorizontal: 20, gap: 10 },
  modelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  modelButtonActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
    borderColor: '#60A5FA'
  },
  modelButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12, fontWeight: '600'
  },
  modelButtonTextActive: { color: 'white' },
  
  modelContainer: {
    height: 280, marginHorizontal: 20, marginVertical: 10,
    borderRadius: 15, overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative'
  },
  webview: { flex: 1, backgroundColor: 'transparent' },
  
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000
  },
  loadingText: { color: 'white', marginTop: 10, fontSize: 16 },
  
  errorOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1000
  },
  errorText: {
    color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10
  },
  retryButtonText: { color: 'white', fontWeight: '600' },
  
  cardsContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 20, gap: 16
  },
  card: {
    flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18, padding: 20, borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16
  },
  cardTitle: {
    fontSize: 16, fontWeight: '600', color: 'white',
    marginBottom: 16, flex: 1
  },
  closeButton: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.6)'
  },
  inputPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10, height: 36, borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', marginBottom: 16
  },
  button: { borderRadius: 18, height: 36, overflow: 'hidden' },
  buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  posSetup: { alignItems: 'center', marginBottom: 20 },
  posText: {
    color: 'rgba(255, 255, 255, 0.8)', fontSize: 14,
    textDecorationLine: 'underline'
  }
});