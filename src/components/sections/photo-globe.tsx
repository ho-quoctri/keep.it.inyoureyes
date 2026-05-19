"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

// Mẫu data ảnh demo (Thay bằng ảnh portfolio của bạn)
const IMAGES = [
  "https://picsum.photos/id/10/300/400",
  "https://picsum.photos/id/11/300/400",
  "https://picsum.photos/id/12/300/400",
  "https://picsum.photos/id/13/300/400",
  "https://picsum.photos/id/14/300/400",
  "https://picsum.photos/id/15/300/400",
  "https://picsum.photos/id/16/300/400",
  "https://picsum.photos/id/17/300/400",
  "https://picsum.photos/id/18/300/400",
  "https://picsum.photos/id/19/300/400",
  "https://picsum.photos/id/20/300/400",
  "https://picsum.photos/id/21/300/400",
  "https://picsum.photos/id/22/300/400",
  "https://picsum.photos/id/23/300/400",
  "https://picsum.photos/id/24/300/400",
];

export const PhotoGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const items = globe.querySelectorAll(".globe-item");
    const total = items.length;
    const radius = 350; // Bán kính quả cầu (pixel) - tăng giảm tùy ý

    // Khởi tạo vị trí 3D cố định của từng item dựa trên phân phối Fibonacci
    const baseCoords: Array<{ x: number; y: number; z: number }> = [];
    const phi = Math.PI * (Math.sqrt(5) - 1); // Tỷ lệ vàng

    items.forEach((item, i) => {
      const y = 1 - (i / (total - 1)) * 2; // y chạy từ 1 đến -1
      const radiusAtY = Math.sqrt(1 - y * y); // Bán kính của đường tròn tại cao độ y

      const theta = phi * i; // Góc quay quanh trục Y

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Nhân với bán kính thực tế của quả cầu
      baseCoords.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
      });
    });

    // Trạng thái góc quay hiện tại và mục tiêu (để làm hiệu ứng đuổi mượt - Smooth Follow)
    const rotation = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    // Hàm cập nhật render tọa độ CSS từng frame bằng GSAP ticker (tối ưu hơn requestAnimationFrame thường)
    const updateGlobe = () => {
      // Nội suy tuyến tính (Linear Interpolation - Lerp) để tạo độ mượt (Inertia/Damping)
      rotation.x += (targetRotation.x - rotation.x) * 0.08;
      rotation.y += (targetRotation.y - rotation.y) * 0.08;

      // Góc quay tính bằng Radian
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      items.forEach((item, i) => {
        const base = baseCoords[i];

        // 1. Xoay quanh trục Y (Horizontal)
        let x1 = base.x * cosY - base.z * sinY;
        let z1 = base.z * cosY + base.x * sinY;

        // 2. Xoay quanh trục X (Vertical)
        let y2 = base.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + base.y * sinX;

        // Tính toán độ mờ (Opacity) và độ phóng to (Scale) dựa trên trục Z (độ sâu)
        // Khi z2 càng lớn (càng gần camera) -> càng rõ và to. z2 nhỏ (ở mặt sau) -> mờ đi.
        const normalizedZ = (z2 + radius) / (2 * radius); // Đưa về khoảng 0 -> 1
        const opacity = gsap.utils.mapRange(0, 1, 0.15, 1, normalizedZ);
        const scale = gsap.utils.mapRange(0, 1, 0.5, 1.1, normalizedZ);

        // Đẩy style trực tiếp bằng GSAP để triệt tiêu việc React Re-render, giữ 60fps mượt mà
        gsap.set(item, {
          x: x1,
          y: y2,
          z: z2,
          scale: scale,
          opacity: opacity,
          // Quyết định layer nào đè lên layer nào trong không gian 2D dựa trên độ sâu Z thực tế
          zIndex: Math.round(z2 + radius),
        });
      });
    };

    // Đăng ký hàm cập nhật vào bộ đếm thời gian của GSAP
    gsap.ticker.add(updateGlobe);

    // Tự động xoay chậm quả cầu khi không tương tác
    const autoRotate = gsap.to(targetRotation, {
      y: "+=360",
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    // Cấu hình kéo thả (Drag) và lăn chuột (Wheel) thông qua GSAP Observer
    const obs = Observer.create({
      target: containerRef.current,
      type: "pointer,touch,wheel",
      onChange: (self) => {
        // Tạm dừng tự động xoay khi người dùng can thiệp trực tiếp
        autoRotate.pause();

        if (self.event.type === "wheel") {
          // Lăn chuột xoay theo trục Y
          targetRotation.y += self.deltaY * 0.1;
        } else {
          // Kéo thả tính toán theo Delta di chuyển chuột/vân tay
          targetRotation.y += self.deltaX * 0.2;
          targetRotation.x -= self.deltaY * 0.2;
        }

        // Giới hạn góc xoay lên/xuống để tránh quả cầu bị lộn nhào mất phương hướng
        targetRotation.x = gsap.utils.clamp(-60, 60, targetRotation.x);

        // Kích hoạt lại hiệu ứng tự xoay sau 2 giây nếu người dùng buông tay không tương tác nữa
        gsap.killTweensOf(resumeAutoRotate);
        gsap.delayedCall(2, resumeAutoRotate);
      },
    });

    function resumeAutoRotate() {
      autoRotate.play();
      // Làm mượt góc quay mục tiêu tiếp tục từ vị trí hiện tại
      gsap.to(targetRotation, {
        y: targetRotation.y + 360,
        duration: 50,
        ease: "none",
        repeat: -1,
        overwrite: "auto",
      });
    }

    // Dọn dẹp bộ nhớ khi Component bị Unmount (Đặc biệt quan trọng trong React)
    return () => {
      gsap.ticker.remove(updateGlobe);
      autoRotate.kill();
      obs.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-background overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1000px" }} // Tạo chiều sâu không gian cho CSS 3D
    >
      {/* Container trung tâm của quả cầu */}
      <div
        ref={globeRef}
        className="relative w-0 h-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {IMAGES.map((src, index) => (
          <div
            key={index}
            className="globe-item absolute interactive w-48 h-48 rounded-xl overflow-hidden  group"
            style={{
              willChange: "transform, opacity", // Báo hiệu trình duyệt tối ưu phần cứng (GPU)
            }}
          >
            <img
              src={src}
              alt={`Project ${index}`}
              className="w-full h-full object-cover  transition-all duration-500 scale-105 group-hover:scale-100"
              draggable={false}
            />            
          </div>
        ))}
      </div>

      {/* Gợi ý tương tác tinh tế góc màn hình */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted font-primary text-xs tracking-wider uppercase pointer-events-none opacity-60 animate-pulse">
        [ Drag or Wheel to Spin Globe ]
      </div>
    </section>
  );
};