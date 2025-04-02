import { Leaf, Globe, Users, Target } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">About Us</h1>
            <p className="text-lg text-gray-300">
              Learn more about our mission to help individuals and businesses reduce their carbon footprint.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              We believe that addressing climate change requires individuals and organizations to understand their environmental impact. 
              Our AI-powered carbon footprint calculator was created to make this process simple, accessible, and actionable.
            </p>
            <p className="text-gray-300">
              Our goal is to empower everyone with the knowledge and tools they need to make more sustainable choices in their 
              daily lives and business operations. By providing detailed insights and personalized recommendations, 
              we hope to contribute to a significant reduction in global carbon emissions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition">
              <div className="flex items-center mb-4">
                <div className="bg-red-900 p-2 rounded-full mr-4">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-white">Our Approach</h3>
              </div>
              <p className="text-gray-300">
                We combine scientific emission factors with machine learning to deliver accurate carbon footprint calculations.
                Our methodology is based on internationally recognized standards and is regularly updated to reflect the latest research.
              </p>
            </div>
            
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition">
              <div className="flex items-center mb-4">
                <div className="bg-red-900 p-2 rounded-full mr-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-white">Our Impact</h3>
              </div>
              <p className="text-gray-300">
                Since our launch, we've helped thousands of individuals and businesses understand and reduce their carbon footprint.
                Together, our users have reduced their collective emissions by thousands of tonnes of CO₂ equivalent.
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Our Team</h2>
            <p className="text-gray-300 mb-6">
              We are a dedicated team of BTech students in Computer Science Engineering (IoT) passionate about leveraging 
              technology to create sustainable solutions for environmental challenges. Our project aims to make carbon 
              footprint tracking accessible to everyone.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <TeamMember
                name="Snehangshu De"
                role="CSE(IOT) BTech Student"
                description="Computer Science and Engineering student specializing in Internet of Things, with a focus on sustainable technology solutions."
              />
              <TeamMember
                name="Anamika Chowdhury"
                role="CSE(IOT) BTech Student"
                description="Computer Science student with expertise in IoT technologies and their environmental applications."
              />
              <TeamMember
                name="Monisha Kar"
                role="CSE(IOT) BTech Student"
                description="Passionate computer science student creating innovative solutions for environmental challenges using IoT."
              />
              <TeamMember
                name="Sanga Bhattacharjee"
                role="CSE(IOT) BTech Student"
                description="Engineering student focused on developing IoT solutions for climate change mitigation and carbon footprint reduction."
              />
              <TeamMember
                name="Rumani Sadhukhan"
                role="CSE(IOT) BTech Student"
                description="BTech student researching applications of IoT in environmental monitoring and sustainability."
              />
              <TeamMember
                name="Chandreyee Laskar"
                role="CSE(IOT) BTech Student"
                description="Computer Science student exploring the intersection of technology and environmental sustainability."
              />
            </div>
          </div>
          
          <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 mb-12">
            <div className="flex items-start mb-4">
              <div className="bg-red-900 p-2 rounded-full mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold font-heading text-white">Our Values</h2>
            </div>
            <ul className="list-disc pl-12 space-y-2 text-gray-300">
              <li>Accuracy and transparency in all our calculations</li>
              <li>Privacy and security of user data</li>
              <li>Accessibility for users of all backgrounds</li>
              <li>Continuous improvement based on scientific research</li>
              <li>Practical solutions that fit into real-world scenarios</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have questions or suggestions? We'd love to hear from you. Reach out to us at <a href="mailto:contact@carboncalculator.com" className="text-red-500 hover:underline">contact@carboncalculator.com</a> or use the form on our contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMember({ name, role, description }: { name: string; role: string; description: string }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 hover:border-red-600 transition">
      <div className="flex items-center mb-3">
        <div className="bg-red-900 p-2 rounded-full mr-3">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-red-500">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
