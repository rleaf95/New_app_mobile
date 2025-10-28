import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const createBackground3DHTML = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://unpkg.com/three@0.144.0/build/three.min.js"></script>
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
            position: fixed;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    
    <script>
        console.log('Three.js Background Starting...');
        
        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x7A94AB);
            
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 8);
            
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: false
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('container').appendChild(renderer.domElement);
            
            // ライト
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
            dirLight1.position.set(10, 10, 5);
            scene.add(dirLight1);
            
            const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight2.position.set(-10, 5, -5);
            scene.add(dirLight2);
            
            const pointLight = new THREE.PointLight(0x60A5FA, 0.5);
            pointLight.position.set(0, 0, 10);
            scene.add(pointLight);
            
            // ガラス状のオブジェクト
            const shapes = [];
            const geometryTypes = [
                () => new THREE.BoxGeometry(1, 1, 1),
                () => new THREE.TetrahedronGeometry(1, 0),
                () => new THREE.IcosahedronGeometry(1, 0),
                () => new THREE.OctahedronGeometry(1, 0)
            ];
            
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xE2E8F0,
                transparent: true,
                opacity: 0.15,
                roughness: 0.1,
                metalness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.05
            });
            
            for (let i = 0; i < 25; i++) {
                const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)]();
                const mesh = new THREE.Mesh(geometry, material);
                
                mesh.position.set(
                    (Math.random() - 0.5) * 18,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 6 - 4
                );
                
                mesh.scale.setScalar(Math.random() * 0.8 + 0.3);
                
                mesh.userData = {
                    initialPosition: mesh.position.clone(),
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.15,
                        y: (Math.random() - 0.5) * 0.15,
                        z: (Math.random() - 0.5) * 0.15
                    },
                    moveSpeed: {
                        x: (Math.random() - 0.5) * 0.7,
                        y: (Math.random() - 0.5) * 0.7,
                        z: (Math.random() - 0.5) * 0.7
                    },
                    moveRange: {
                        x: Math.random() * 3 + 2,
                        y: Math.random() * 3 + 2,
                        z: Math.random() * 2 + 1
                    }
                };
                
                shapes.push(mesh);
                scene.add(mesh);
            }
            
            // 光る点
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: 0x60A5FA,
                transparent: true,
                opacity: 1
            });
            
            for (let i = 0; i < 15; i++) {
                const dot = new THREE.Mesh(
                    new THREE.SphereGeometry(Math.random() * 0.05 + 0.02, 8, 8),
                    dotMaterial
                );
                dot.position.set(
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 8 - 3
                );
                scene.add(dot);
            }
            
            console.log('Scene created with', shapes.length, 'shapes');
            
            // アニメーション
            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                
                const delta = clock.getDelta();
                const time = clock.getElapsedTime();
                
                shapes.forEach(mesh => {
                    const data = mesh.userData;
                    
                    mesh.rotation.x += data.rotationSpeed.x * delta;
                    mesh.rotation.y += data.rotationSpeed.y * delta;
                    mesh.rotation.z += data.rotationSpeed.z * delta;
                    
                    mesh.position.x = data.initialPosition.x + Math.sin(time * data.moveSpeed.x) * data.moveRange.x;
                    mesh.position.y = data.initialPosition.y + Math.sin(time * data.moveSpeed.y) * data.moveRange.y;
                    mesh.position.z = data.initialPosition.z + Math.sin(time * data.moveSpeed.z) * data.moveRange.z;
                });
                
                renderer.render(scene, camera);
            }
            animate();
            
            console.log('Animation started');
            
            // リサイズ対応
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
            
            // React Nativeに通知
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'BACKGROUND_READY'
                }));
            }
            
        } catch (error) {
            console.error('Background3D Error:', error);
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'BACKGROUND_ERROR',
                    error: error.message
                }));
            }
        }
    </script>
</body>
</html>`;

export function Background3D() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
        source={{ html: createBackground3DHTML() }}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Background3D:', data.type);
          } catch (e) {
            // ignore
          }
        }}
        onLoadEnd={() => console.log('Background3D WebView loaded')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
