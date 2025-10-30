import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Users, Clock, Shield } from 'lucide-react';

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Hệ thống <span className="text-primary">Quản lý Thư viện</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nền tảng hiện đại để quản lý sách, mượn trả và theo dõi hoạt động thư viện một cách hiệu quả.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/books">
              <BookOpen className="w-5 h-5 mr-2" />
              Khám phá sách
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/register">Đăng ký ngay</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Quản lý sách</CardTitle>
            <CardDescription>
              Hệ thống danh mục sách phong phú với tìm kiếm thông minh
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Người dùng</CardTitle>
            <CardDescription>
              Quản lý thông tin người dùng và phân quyền truy cập
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Mượn trả</CardTitle>
            <CardDescription>
              Theo dõi lịch sử mượn trả và nhắc nhở hạn trả sách
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Bảo mật</CardTitle>
            <CardDescription>
              Hệ thống bảo mật cao với phân quyền chi tiết
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="bg-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-4">Thống kê hệ thống</h2>
          <p className="text-muted-foreground">Những con số ấn tượng về thư viện của chúng tôi</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl text-primary mb-2">1,250+</div>
            <div className="text-muted-foreground">Đầu sách</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-primary mb-2">450+</div>
            <div className="text-muted-foreground">Người dùng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-primary mb-2">2,800+</div>
            <div className="text-muted-foreground">Lượt mượn</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Hài lòng</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary/5 rounded-2xl p-8">
        <h2 className="text-3xl mb-4">Bắt đầu sử dụng ngay hôm nay</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Tham gia cộng đồng độc giả và khám phá hàng ngàn đầu sách chất lượng cao.
        </p>
        <Button size="lg" asChild>
          <Link to="/books">
            Khám phá ngay
          </Link>
        </Button>
      </section>
    </div>
  );
}