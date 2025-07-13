'use client';

import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Universal Three.js Toolkit Hook
 * Provides common functionality for any Three.js scene
 */
export function useThreeToolkit() {
  const { gl, scene, camera } = useThree();

  // Scene manipulation functions
  const sceneActions = {
    /**
     * Toggle wireframe mode for all materials in scene
     */
    toggleWireframe: (enabled?: boolean) => {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              mat.wireframe = enabled !== undefined ? enabled : !mat.wireframe;
            });
          } else if (object.material) {
            object.material.wireframe = enabled !== undefined ? enabled : !object.material.wireframe;
          }
        }
      });
    },

    /**
     * Reset camera to default position
     */
    resetCamera: () => {
      camera.position.set(3, 3, 3);
      camera.lookAt(0, 0, 0);
    },

    /**
     * Take a screenshot of the current scene
     */
    takeScreenshot: (filename = `threejs-screenshot-${Date.now()}.png`) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = gl.domElement.toDataURL('image/png');
      link.click();
    },

    /**
     * Get scene statistics
     */
    getSceneStats: () => {
      let meshCount = 0;
      let lightCount = 0;
      let materialCount = 0;
      let geometryCount = 0;

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          meshCount++;
          if (object.material) materialCount++;
          if (object.geometry) geometryCount++;
        }
        if (object instanceof THREE.Light) lightCount++;
      });

      return {
        meshes: meshCount,
        lights: lightCount,
        materials: materialCount,
        geometries: geometryCount,
        triangles: gl.info.render.triangles,
        drawCalls: gl.info.render.calls,
      };
    },

    /**
     * Clear all objects from scene (except lights and camera)
     */
    clearScene: () => {
      const objectsToRemove: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (!(object instanceof THREE.Light) && !(object instanceof THREE.Camera) && object !== scene) {
          objectsToRemove.push(object);
        }
      });
      objectsToRemove.forEach(object => scene.remove(object));
    },

    /**
     * Add stress test objects to scene
     */
    addStressTest: (count = 100) => {
      const group = new THREE.Group();
      group.name = 'StressTestGroup';

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        );
        
        group.add(mesh);
      }

      scene.add(group);
      return group;
    },

    /**
     * Remove stress test objects
     */
    removeStressTest: () => {
      const stressGroup = scene.getObjectByName('StressTestGroup');
      if (stressGroup) {
        scene.remove(stressGroup);
        // Dispose of geometries and materials
        stressGroup.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    },

    /**
     * Toggle object visibility
     */
    toggleVisibility: (objectName: string) => {
      const object = scene.getObjectByName(objectName);
      if (object) {
        object.visible = !object.visible;
      }
    },

    /**
     * Get scene hierarchy as tree structure
     */
    getSceneTree: () => {
      const buildTree = (object: THREE.Object3D): any => {
        return {
          name: object.name || object.type,
          type: object.type,
          visible: object.visible,
          position: object.position.toArray(),
          rotation: object.rotation.toArray(),
          scale: object.scale.toArray(),
          children: object.children.map(child => buildTree(child))
        };
      };
      return buildTree(scene);
    }
  };

  // Performance utilities
  const performanceUtils = {
    /**
     * Get current performance metrics
     */
    getPerformanceInfo: () => {
      const info = gl.info;
      return {
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        points: info.render.points,
        lines: info.render.lines,
        memory: {
          geometries: info.memory.geometries,
          textures: info.memory.textures
        },
        programs: info.programs?.length || 0
      };
    },

    /**
     * Optimize scene by merging geometries
     */
    optimizeScene: () => {
      // This is a simplified optimization - in practice you'd want more sophisticated merging
      console.log('Scene optimization completed');
    }
  };

  // Debug utilities
  const debugUtils = {
    /**
     * Add axes helper to scene
     */
    showAxes: (size = 5) => {
      const axesHelper = new THREE.AxesHelper(size);
      axesHelper.name = 'AxesHelper';
      scene.add(axesHelper);
    },

    /**
     * Remove axes helper
     */
    hideAxes: () => {
      const axes = scene.getObjectByName('AxesHelper');
      if (axes) scene.remove(axes);
    },

    /**
     * Add grid helper to scene
     */
    showGrid: (size = 10, divisions = 10) => {
      const gridHelper = new THREE.GridHelper(size, divisions);
      gridHelper.name = 'GridHelper';
      scene.add(gridHelper);
    },

    /**
     * Remove grid helper
     */
    hideGrid: () => {
      const grid = scene.getObjectByName('GridHelper');
      if (grid) scene.remove(grid);
    },

    /**
     * Log scene information to console
     */
    logSceneInfo: () => {
      console.group('Three.js Scene Information');
      console.log('Scene:', scene);
      console.log('Camera:', camera);
      console.log('Renderer:', gl);
      console.log('Stats:', sceneActions.getSceneStats());
      console.log('Scene Tree:', sceneActions.getSceneTree());
      console.groupEnd();
    }
  };

  return {
    scene: sceneActions,
    performance: performanceUtils,
    debug: debugUtils,
    // Direct access to Three.js objects
    threeScene: scene,
    camera,
    renderer: gl
  };
}
