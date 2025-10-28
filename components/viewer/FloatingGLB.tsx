import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface FloatingGLBProps {
  modelUrl: string;
  size?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  modelYOffset? : number;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
  frontLightIntensity?: number;
  fillLightIntensity?: number;

}

const createFloatingGLBHTML = (
  url: string,
  cameraPos: [number, number, number],
  cameraLook: [number, number, number],
  ambientIntensity: number,
  dirIntensity: number,
  frontIntensity: number,
  fillIntensity: number
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <script src="https://unpkg.com/three@0.144.0/build/three.min.js"></script>
    <script src="https://unpkg.com/three@0.144.0/examples/js/loaders/GLTFLoader.js"></script>
    
    <style>
        * { margin: 0; padding: 0; }
        html, body { 
            width: 100%; 
            height: 100%; 
            overflow: hidden; 
            background: transparent;
        }
        #container { 
            width: 100%; 
            height: 100%; 
            position: relative;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    
    <script>
        console.log('Floating GLB Starting...');
        
        const container = document.getElementById('container');
        
        if (typeof THREE === 'undefined') {
            console.error('Three.js not loaded');
            window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'MODEL_ERROR', error: 'Three.js not loaded'
            }));
        } else {
            try {
                const scene = new THREE.Scene();
                scene.background = null;
                
                const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ 
                    alpha: true, 
                    antialias: true 
                });
                
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                renderer.setSize(width, height);
                renderer.setClearColor(0x000000, 0);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                container.appendChild(renderer.domElement);
                
                // カメラ位置を調整可能に
                camera.position.set(${cameraPos[0]}, ${cameraPos[1]}, ${cameraPos[2]});
                camera.lookAt(${cameraLook[0]}, ${cameraLook[1]}, ${cameraLook[2]});
                
                // 環境光
                const ambientLight = new THREE.AmbientLight(0xffffff, ${ambientIntensity});
                scene.add(ambientLight);
                
                // メインライト（上から斜め前）
                const mainLight = new THREE.DirectionalLight(0xffffff, ${dirIntensity});
                mainLight.position.set(2, 5, 3);
                mainLight.castShadow = true;
                mainLight.shadow.mapSize.width = 1024;
                mainLight.shadow.mapSize.height = 1024;
                mainLight.shadow.camera.near = 0.5;
                mainLight.shadow.camera.far = 50;
                scene.add(mainLight);
                
                // 正面ライト
                const frontLight = new THREE.DirectionalLight(0xffffff, ${frontIntensity});
                frontLight.position.set(0, 2, 5);
                scene.add(frontLight);
                
                // 補助光（下から）
                const fillLight = new THREE.DirectionalLight(0xffffff, ${fillIntensity});
                fillLight.position.set(0, -2, 3);
                scene.add(fillLight);
                
                // 左右からの補助光
                const leftLight = new THREE.DirectionalLight(0xffffff, 0.4);
                leftLight.position.set(-5, 1, 2);
                scene.add(leftLight);
                
                const rightLight = new THREE.DirectionalLight(0xffffff, 0.4);
                rightLight.position.set(5, 1, 2);
                scene.add(rightLight);
                
                // 影を受ける平面
                const shadowPlane = new THREE.Mesh(
                    new THREE.PlaneGeometry(10, 10),
                    new THREE.ShadowMaterial({ opacity: 0.3 })
                );
                shadowPlane.rotation.x = -Math.PI / 2;
                shadowPlane.position.y = -1;
                shadowPlane.receiveShadow = true;
                scene.add(shadowPlane);
                
                // GLTFLoader
                const loader = new THREE.GLTFLoader();
                
                loader.load(
                    '${url}',
                    function(gltf) {
                        const model = gltf.scene;
                        
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                                if (child.material) {
                                    child.material.needsUpdate = true;
                                }
                            }
                        });
                        
                        const box = new THREE.Box3().setFromObject(model);
                        const size = box.getSize(new THREE.Vector3()).length();
                        const scale = 1.8 / size;
                        model.scale.multiplyScalar(scale);
                        
                        const center = box.getCenter(new THREE.Vector3());
                        model.position.copy(center).multiplyScalar(-scale);
                        model.position.y -= 0;
                        
                        scene.add(model);
                        
                        console.log('Floating model loaded');
                        window.ReactNativeWebView?.postMessage(JSON.stringify({
                            type: 'MODEL_LOADED'
                        }));
                        
                        const clock = new THREE.Clock();
                        const initialY = model.position.y;
                        
                        function animate() {
                            requestAnimationFrame(animate);
                            
                            const time = clock.getElapsedTime();
                            
                            // 上下にふわふわ
                            model.position.y = initialY + Math.sin(time * 0.8) * 0.15;
                            
                            // Y軸回転
                            const rotationAngle = Math.sin(time * 0.5) * -0.10;
                            model.rotation.y = rotationAngle;
                            
                            renderer.render(scene, camera);
                        }
                        animate();
                    },
                    function(progress) {
                        if (progress.lengthComputable) {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            console.log('Loading:', percent + '%');
                        }
                    },
                    function(error) {
                        console.error('Model load error:', error);
                        window.ReactNativeWebView?.postMessage(JSON.stringify({
                            type: 'MODEL_ERROR', error: error.message
                        }));
                    }
                );
                
                window.addEventListener('resize', function() {
                    const w = container.clientWidth;
                    const h = container.clientHeight;
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);
                });
                
            } catch (error) {
                console.error('Setup error:', error);
            }
        }
    </script>
</body>
</html>`;

export function FloatingGLB({
  modelUrl,
  size = 200,
  position = 'bottom-right',
  cameraPosition = [0, 0.3, 2.5],
  cameraLookAt = [0, 0.3, 0],
  ambientLightIntensity = 1.5,
  directionalLightIntensity = 1.2,
  frontLightIntensity = 2.0,
  fillLightIntensity = 0.8,
}: FloatingGLBProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'MODEL_LOADED':
          setIsLoaded(true);
          console.log('✅ Floating GLB loaded');
          break;
          
        case 'MODEL_ERROR':
          console.error('❌ Floating GLB error:', data.error);
          break;
      }
    } catch (error) {
      console.error('Message parse error:', error);
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      case 'top-right':
        return { top: 20, right: 20 };
      case 'top-left':
        return { top: 20, left: 20 };
      default:
        return { bottom: 20, right: 20 };
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        getPositionStyle(),
        { width: size, height: size }
      ]}
      pointerEvents="none"
    >
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
        source={{ 
          html: createFloatingGLBHTML(
            modelUrl,
            cameraPosition,
            cameraLookAt,
            ambientLightIntensity,
            directionalLightIntensity,
            frontLightIntensity,
            fillLightIntensity
          ) 
        }}
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    overflow: 'visible',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});