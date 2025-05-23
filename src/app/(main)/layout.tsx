import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Providers } from '../providers'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-20 pb-10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </>
      </body>
    </html>
  )
}